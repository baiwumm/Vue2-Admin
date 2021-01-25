简体中文 | [English](./README.md)

<p align="center"><img width="100" src="https://xmwpro.oss-cn-beijing.aliyuncs.com/vue-admin-xmw-pro/logo.svg" alt="Vue-Admin-Xmw-Pro Logo"></p>

<h1 align="center">Vue-Admin-Xmw-Pro</h1>

<p align="center">
  <a href="https://github.com/eggjs/egg" target="_blank">
    <img src="https://xmwpro.oss-cn-beijing.aliyuncs.com/vue-admin-xmw-pro/egg.svg" alt="egg">
  </a>
  <a href="https://github.com/eggjs/egg-redis" target="_blank">
    <img src="https://xmwpro.oss-cn-beijing.aliyuncs.com/vue-admin-xmw-pro/redis.svg" alt="egg-redis">
  </a>
  <a href="https://github.com/eggjs/egg-socket.io" target="_blank">
    <img src="https://xmwpro.oss-cn-beijing.aliyuncs.com/vue-admin-xmw-pro/socket.svg" alt="egg-socket.io">
  </a>
  <a href="https://github.com/auth0/node-jsonwebtoken" target="_blank">
    <img src="https://xmwpro.oss-cn-beijing.aliyuncs.com/vue-admin-xmw-pro/token.svg" alt="jsonwebtoken">
  </a>
  <a href="https://github.com/sequelize/sequelize" target="_blank">
    <img src="https://xmwpro.oss-cn-beijing.aliyuncs.com/vue-admin-xmw-pro/socket.svg" alt="sequelize">
  </a>
  <a>
    <img src="https://xmwpro.oss-cn-beijing.aliyuncs.com/vue-admin-xmw-pro/build.svg">
  </a>
</p>

## 项目简介

[vue-admin-xmw-pro](https://github.com/FollowTrend/vue-admin-xmw-pro/tree/master/Xmw_web) 是一个后台管理系统解决方案，后端基于 [egg.js](https://github.com/eggjs/egg) 和 [sequelize](https://github.com/sequelize/sequelize/)实现。它使用了最新的前端技术栈，提供了丰富的功能组件，希望本项目可以帮助到您。

- 线上预览: http://www.xmwpro.com

- 文档地址：**正在编写中！**

- 前端地址：[传送门](../Xmw_web)

## 环境和依赖

- node
- yarn

> 推荐本项目使用 [Yarn](https://yarnpkg.com/) 包管理工具

## 项目运行

- 拉取项目代码
```bash
git clone https://github.com/FollowTrend/vue-admin-xmw-pro.git
cd vue-admin-xmw-pro
cd Xmw_server
```

- 安装依赖
```
yarn install
```

- 开发模式运行
```
yarn run dev
```

## 目录结构

```
├── app/
    ├── controller(用于解析用户的输入)
    ├── extend(框架的扩展)
    ├── io(egg-socket.io框架配置)
    ├── middleware( 用于编写中间件)
    ├── public(用于放置静态资源)
    ├── service(用于编写业务逻辑层)
    ├── router.js(用于配置 URL 路由规则)
├── config/
    ├── config.{env}.js(用于编写配置文件)
    ├── plugin.js(用于配置需要加载的插件)
```

## 特别鸣谢（感谢巨人）

| 项目                                                          |
| ---------------------------------------------------------------- |
| [egg.js 为企业级框架和应用而生](https://github.com/eggjs/egg)                              |
| [egg-socket.io 支持浏览器和服务器之间的实时、双向和基于事件的通信](https://github.com/eggjs/egg-socket.io)     |
| [jsonwebtoken 实现token技术的一种解决方案](https://github.com/auth0/node-jsonwebtoken) |
| [sequelize orm框架](https://github.com/sequelize/sequelize)                          |
