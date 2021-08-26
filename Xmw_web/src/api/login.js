/*
 * @Description: 用户登录请求接口
 * @Version: 2.0
 * @Autor: Xie Mingwei
 * @Date: 2020-09-17 09:34:18
 * @LastEditors: Xie Mingwei
 * @LastEditTime: 2021-08-26 16:03:01
 */
import request from '@/utils/request'

const userApi = {
    Login: '/home/login',
    Logout: '/home/logout',
    updateUserInfo: '/home/updateUserInfo',
    changeUserPassword: '/home/changeUserPassword',
    changeUserLabel: '/home/changeUserLabel',
    changeUserImg: '/home/changeUserImg',
    UserPw: '/home/getUserPw',
    generateVerifCode: '/home/generateVerifCode',
}
// 用户登录
export function login(parameter) {
    return request({
        url: userApi.Login,
        method: 'post',
        data: parameter
    })
}

// 注销登录
export function logout(parameter) {
    return request({
        url: userApi.Logout,
        method: 'post',
        data: parameter
    })
}
// 更新用户信息
export function updateUserInfo(parameter) {
    return request({
        url: userApi.updateUserInfo,
        method: 'post',
        data: parameter
    })
}
// 修改用户密码
export function changeUserPassword(parameter) {
    return request({
        url: userApi.changeUserPassword,
        method: 'post',
        data: parameter
    })
}
// 修改用户标签
export function changeUserLabel(parameter) {
    return request({
        url: userApi.changeUserLabel,
        method: 'post',
        data: parameter
    })
}
// 修改用户头像
export function changeUserImg(parameter) {
    return request({
        url: userApi.changeUserImg,
        method: 'post',
        data: parameter
    })
}
// 修改用户头像
export function UserPw(parameter) {
    return request({
        url: userApi.UserPw,
        method: 'get',
        params: parameter
    })
}

// 生成验证码
export function generateVerifCode(parameter) {
    return request({
        url: userApi.generateVerifCode,
        method: 'get',
        params: parameter
    })
}
