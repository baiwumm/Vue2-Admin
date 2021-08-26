/*
 * @Description: 用户登录退出请求接口
 * @Version: 2.0
 * @Autor: Xie Mingwei
 * @Date: 2020-09-17 09:44:16
 * @LastEditors: Xie Mingwei
 * @LastEditTime: 2021-08-26 16:09:10
 */
'use strict';

const Controller = require('egg').Controller;
const jwt = require('jsonwebtoken');
//异步二进制 写入流
const awaitWriteStream = require("await-stream-ready").write;
const fs = require('fs');
const path = require('path');
const svgCaptcha = require('svg-captcha');
class HomeController extends Controller {
    // 用户登录
    async login() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { username, password, verifyCode } = ctx.request.body
            let payload = ctx.request.body
            let LoginIP = ctx.request.ip
            let token = jwt.sign(payload, this.config.privateKey, { expiresIn: this.config.expiresIn });  //生成token
            // 判断验证码是否正确
            if (ctx.session.verifCode != verifyCode) {
                return ctx.body = { state: 0, msg: '验证码错误!' }
            }
            // 判断用户名密码是否正确
            const results = await Raw.QueryList(`select * from xmw_user where username = '${username}' and password = '${password}'`);
            if (results.length) {
                let v = results[0]
                if (v.Status == 1) {
                    v.token = token
                    v.expiresIn = this.config.expiresIn
                    let roleList = JSON.parse(v.roleList).join(',')
                    let roleArr = [], permissionArr = []
                    const results = await Raw.QueryList(`select roleList from xmw_role where status = 1 and FIND_IN_SET(roleName,'${roleList}')`);
                    // 多个角色，先将操作合并再去重
                    results.map(o => {
                        JSON.parse(o.roleList).map(e => {
                            e.roleId = v.username
                            if (!permissionArr[e.permissionId]) {
                                permissionArr[e.permissionId] = e
                            } else {
                                permissionArr[e.permissionId].actions = [...permissionArr[e.permissionId].actions, ...e.actions]
                                permissionArr[e.permissionId].actionList = [...permissionArr[e.permissionId].actionList, ...e.actionList]
                            }

                        })
                    })
                    roleArr = Object.values(permissionArr)
                    // 权限去重
                    roleArr.forEach(v => {
                        v.actions = Array.from(new Set(v.actions))
                        v.actionList = Array.from(new Set(v.actionList))
                    })
                    roleArr.push({
                        roleId: v.username,
                        permissionId: 'index',
                        permissionName: '主页',
                        actionList: []
                    })
                    let roleObj = {
                        permissions: roleArr
                    }
                    v.role = roleObj
                    // 更新token和IP、登录时间、登录次数
                    let loginNum = v.loginNum || 0
                    const row = {
                        token: token,
                        LoginIP: LoginIP,
                        LoginLastTime: new Date(),
                        loginNum: loginNum + 1
                    };

                    const options = {
                        wherestr: `where UserID=${v.UserID}`
                    };
                    ctx.session.userInfo = {
                        UserID: v.UserID,
                        username: v.username,
                        CnName: v.CnName,
                        token: token
                    }
                    ctx.body = { state: 1, msg: '登录成功!', result: v }
                    await Raw.Update('xmw_user', row, options);
                    await ctx.service.logs.saveLogs(v.username, v.CnName, '登录', '/user/login')
                } else {
                    ctx.body = { state: 0, msg: '此用户已被禁用,请联系管理员!' }
                }
            } else {
                ctx.body = { state: 0, msg: '用户名或密码错误!' }
            }
        } catch (error) {
            ctx.logger.info('login方法报错：' + error)
            ctx.body = { state: 0, msg: '登录失败!', error: error }
        }
    }

    // 注销登录
    async logout() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { UserID, username, CnName } = ctx.session.userInfo
            let logoutInfo = { token: '' }
            const options = {
                wherestr: `where UserID=${UserID}`
            };
            await Raw.Update('xmw_user', logoutInfo, options);
            await ctx.service.logs.saveLogs(username, CnName, '注销登录', '')
            ctx.body = { state: 1, msg: '注销成功!' }
        } catch (error) {
            ctx.logger.info('logout方法报错：' + error)
            ctx.body = { state: 0, msg: '注销失败!', error: error }
        }
    }

    // 更新用户信息
    async updateUserInfo() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { UserID, username, CnName } = ctx.session.userInfo
            let userinfo = ctx.request.body
            userinfo.UpdateLastTime = new Date()
            userinfo.SectorJobs = JSON.stringify(userinfo.SectorJobs)
            userinfo.department = JSON.stringify(userinfo.department)
            userinfo.address = JSON.stringify(userinfo.address)
            const options = {
                wherestr: `where UserID=${UserID}`
            };
            await Raw.Update('xmw_user', userinfo, options);
            await ctx.service.logs.saveLogs(username, CnName, '更新用户信息', '/personal/center')
            ctx.body = { state: 1, msg: '保存成功!' }
        } catch (error) {
            ctx.logger.info('updateUserInfo方法报错：' + error)
            ctx.body = { state: 0, msg: '保存失败!', error: error }
        }
    }

    // 修改用户密码
    async changeUserPassword() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { UserID, username, CnName } = ctx.session.userInfo
            let passwordParams = ctx.request.body
            let result = await Raw.Query(`select password from xmw_user where UserID=${UserID}`)
            if (passwordParams.originalPassword == result.password) {
                let row = { password: passwordParams.lastPassword };
                let options = {
                    wherestr: `where UserID=${UserID}`
                };
                await Raw.Update('xmw_user', row, options);
                await ctx.service.logs.saveLogs(username, CnName, '修改用户密码', '/personal/center')
                ctx.body = { state: 1, msg: '密码修改成功!' }
            } else {
                ctx.body = { state: 0, msg: '原密码输入错误!' }
            }
        } catch (error) {
            ctx.logger.info('changeUserPassword方法报错：' + error)
            ctx.body = { state: 0, msg: '保存失败!', error: error }
        }
    }

    // 修改用户标签
    async changeUserLabel() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { UserID, username, CnName } = ctx.session.userInfo
            let labelParams = ctx.request.body
            labelParams.label = JSON.stringify(labelParams.label)
            let options = {
                wherestr: `where UserID=${UserID}`
            };
            await Raw.Update('xmw_user', labelParams, options);
            await ctx.service.logs.saveLogs(username, CnName, '更新用户标签', '/personal/center')
            ctx.body = { state: 1, msg: '保存成功!' }
        } catch (error) {
            ctx.logger.info('changeUserLabel方法报错：' + error)
            ctx.body = { state: 0, msg: '保存失败!', error: error }
        }
    }

    // 修改用户头像
    async changeUserImg() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let host = ctx.request.header.host
            let { UserID, username, CnName } = ctx.session.userInfo
            //1.获取文件流
            const stream = await this.ctx.getFileStream();
            //2.获取图片类型
            const fileExt = stream.filename.substr(stream.filename.lastIndexOf("."));
            const SaveFileName = stream.fields.SaveFileName;
            let filename = ctx.helper.dataFormat(new Date(), "yyyyMMddhhmmss") + "_" + Math.floor(Math.random() * 10000 + 1000) + fileExt;
            const url = 'app/public/' + SaveFileName;
            //2.保存路径是否存在,不存在则逐级创建目录
            if (!fs.existsSync(url)) {
                url.split(path.sep).reduce((currentPath, folder) => {
                    currentPath += folder + path.sep;
                    if (!fs.existsSync(currentPath)) {
                        fs.mkdirSync(currentPath);
                    }
                    return currentPath;
                }, "");
            }
            //3.保存文件
            const savepath = path.join(url, filename);
            const writeStream = fs.createWriteStream(savepath);
            await awaitWriteStream(stream.pipe(writeStream));
            let basePath = 'public/' + SaveFileName + "/" + filename;
            const imgUrl = { avatar: 'http://' + host + '/' + basePath }
            const options = {
                wherestr: `where UserID=${UserID}`
            };
            await Raw.Update('xmw_user', imgUrl, options);
            await ctx.service.logs.saveLogs(username, CnName, '更新用户头像', '/personal/center')
            ctx.body = {
                state: 1,
                fullPath: 'http://' + host + '/' + basePath,
                url: basePath,
                msg: "上传成功"
            }
        } catch (error) {
            ctx.logger.info('changeUserImg方法报错：' + error)
            ctx.body = { state: 0, msg: '上传失败!', error: error }
        }
    }

    // 获取当前用户密码
    async getUserPw() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { UserID } = ctx.session.userInfo
            let password = await Raw.Query(`select password from xmw_user where UserID = '${UserID}'`)
            ctx.body = { state: 1, msg: '请求成功!', result: password }
        } catch (error) {
            ctx.logger.info('getUserPw方法报错：' + error)
            ctx.body = { state: 0, msg: '请求失败!', error: error }
        }
    }

    /**
     * @description: 生成验证码
     * @param {*}
     * @return {*}
     */
    async generateVerifCode() {
        const { ctx } = this;
        try {
            const codeConfig = {
                size: 4, // 验证码长度
                ignoreChars: '0oO1ilI', // 验证码字符中排除 0oO1ilI
                noise: 2, // 干扰线条的数量
                width: 160,
                height: 40,
                fontSize: 50,
                color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
                background: '#fff',
            };
            const captcha = svgCaptcha.create(codeConfig);
            ctx.response.type = 'image/svg+xml';
            ctx.session.verifCode = captcha.text.toLowerCase(); // 存session用于验证接口获取文字码
            ctx.body = { state: 1, msg: '请求成功!', result: captcha.data }
        } catch (error) {
            ctx.logger.info('generateVerifCode方法报错：' + error)
            ctx.body = { state: 400, msg: '请求失败!', result: error }
        }
    }
}

module.exports = HomeController;
