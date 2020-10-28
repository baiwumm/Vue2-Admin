
'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = exports = {
        Db: {
            xmw: {
                dialect: "mysql",
                database: 'owner_xmw',
                host: "127.0.0.1",
                username: 'root',
                password: '',
                dialectOptions: {
                    dateStrings: true,
                    typeCast: true
                },
                timezone: '+08:00', // 保存为本地时区
                port: 3306,
                dialectOptions: {
                    dateStrings: true,
                    typeCast(field, next) {
                        if (field.type === "DATETIME") {
                            return field.string();
                        }
                        return next();
                    }
                }
            }
        }
    };
    config.cluster = {
        listen: {
            port: 7001,
            hostname: "127.0.0.1",
            // path: '/var/run/egg.sock',
        },
    },
        config.session = {
            key: 'SESSION_ID',  //eggjs默认session的key
            maxAge: 3 * 24 * 3600 * 1000,  // 3 day
            httpOnly: true,
            encrypt: true,
            signed: true,
            renew: true  //每次访问页面都会给session会话延长时间
        };
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1600307035362_2124';
    config.proxy = true;
    // 引入token验证方法中间件
    // config.middleware = ['tokenAuthentication'];
    config.expiresIn = 3 * 24 * 60 * 60 * 1000;// token过期时间 单位秒
    config.privateKey = 'Xmingwei'; // token密钥，生成解析token
    config.security = {
        csrf: {
            enable: false,
        },
        domainWhiteList: ['http://127.0.0.1:8000']
    }
    config.cors = {
        origin: 'http://127.0.0.1:8000',//匹配规则  域名+端口  *则为全匹配
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
        credentials: true // 支持cookie跨域
    };
    // 文件上传
    config.multipart = {
        fileSize: "2mb",
        mode: "stream",
        whitelist: ['.jpg', '.jpeg', '.png']
    };
    return {
        ...config
    };
};
