简体中文 | [English](./README.en-US.md)

<p align="center"><img width="100" src="https://cdn.baiwumm.com/project/vue2-admin/logo.svg" alt="Vue2 Admin"></p>

<h1 align="center">Vue2 Admin</h1>

<p align="center">
  <a href="https://github.com/vuejs/vue/" target="_blank">
    <img src="https://cdn.baiwumm.com/project/vue2-admin/shield/vue.svg" alt="vue">
  </a>
  <a href="https://github.com/vueComponent/ant-design-vue/" target="_blank">
    <img src="https://cdn.baiwumm.com/project/vue2-admin/shield/antd.svg" alt="Ant Design of Vue">
  </a>
  <a href="https://github.com/eggjs/egg/" target="_blank">
    <img src="https://cdn.baiwumm.com/project/vue2-admin/shield/egg.svg" alt="egg">
  </a>
  <a href="https://github.com/sequelize/sequelize/" target="_blank">
    <img src="https://cdn.baiwumm.com/project/vue2-admin/shield/socket.svg" alt="sequelize">
  </a>
  <a>
    <img src="https://cdn.baiwumm.com/project/vue2-admin/shield/build.svg">
  </a>
</p>

## 项目简介

[Vue2 Admin](https://vue2.baiwumm.com/) 是一个后台管理系统解决方案，它基于 [Vue2.0](https://github.com/vuejs/vue/) 和 [Ant Design Vue Pro](https://github.com/vueComponent/ant-design-vue-pro/)实现。它使用了最新的前端技术栈，提供了丰富的功能组件，希望本项目可以帮助到您。

- 😝 线上预览: https://vue2.baiwumm.com

- 🔑 用户名：**admin**，密码：**123456**

- 🔗 后端传送门：[Xmw_server](../Xmw_server)

- ❤️ star：**如果可以的话，请顺手给个star，表示对作者的鼓励，万分感谢！**

## 环境和依赖

- node
- yarn
- webpack
- @vue/cli

> 推荐本项目使用 [Yarn](https://yarnpkg.com/) 包管理工具

## 项目运行

- 拉取项目代码
```bash
git clone https://github.com/baiwumm/Vue2-Admin.git
cd Vue2-Admin
cd Xmw_web
```

- 安装依赖
```
yarn install
```

- 开发模式运行
```
yarn run serve
```

- 编译项目
```
yarn run build
```

## 目录结构

```
├── src/
    ├── api(用于放置服务api接口)
    ├── assets(用于放置本地静态资源)
    ├── components(用于放置业务通用组件)
    ├── config(项目基础配置，包含路由，全局设置)
    ├── core(项目引导, 全局配置初始化，依赖包引入等)
    ├── layouts(项目通用布局)
    ├── locales(国际化资源)
    ├── router(Vue-Router)
    ├── store(Vuex)
    ├── utils(工具类)
    ├── views(业务页面入口和常用模板)
    ├── App.vue(Vue 模板入口)
    ├── main.js(Vue 入口 JS)
    ├── permission.js(路由守卫(路由权限控制))
    ├── global.less(全局样式)
```

## 功能模块

```
- 登录 / 注销

- 工作台

- 综合组件
  - 高级表单
  - 通知公告
  - 组织架构
  - 高级表格
  - 高级详情

- 个人中心

- 系统设置
  - 用户列表
  - 菜单管理
  - 角色管理
  - 权限管理
  - 操作日志
  - 字典管理

- 功能页
  - 生成二维码
  - 富文本编辑器
  - 自定义vue指令
  - 图像识别
  - 聊天室
  - 瀑布流
  - 音乐播放器
  - 视频播放器
  - 懒加载

- 工具页
  - 图片效果
  - 嵌套路由
  - 验证码
  - 引导页
  - 外链
  - 信用卡表单
```

## 演示图

| ![](https://cdn.baiwumm.com/project/vue2-admin/demo/1.jpg!baiwu) | ![](https://cdn.baiwumm.com/project/vue2-admin/demo/2.jpg!baiwu) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![](https://cdn.baiwumm.com/project/vue2-admin/demo/3.jpg!baiwu) | ![](https://cdn.baiwumm.com/project/vue2-admin/demo/4.jpg!baiwu) |
| ![](https://cdn.baiwumm.com/project/vue2-admin/demo/5.jpg!baiwu) | ![](https://cdn.baiwumm.com/project/vue2-admin/demo/6.jpg!baiwu) |
| ![](https://cdn.baiwumm.com/project/vue2-admin/demo/7.jpg!baiwu) | ![](https://cdn.baiwumm.com/project/vue2-admin/demo/8.jpg!baiwu) |
| ![](https://cdn.baiwumm.com/project/vue2-admin/demo/9.jpg!baiwu) | ![](https://cdn.baiwumm.com/project/vue2-admin/demo/10.jpg!baiwu) |

## 特别鸣谢（感谢巨人）

| 项目                                                          |
| ---------------------------------------------------------------- |
| [Vue2.0 构建用户界面的渐进式框架](https://github.com/vuejs/vue)                              |
| [Ant Design Vue Pro基于Antd Vue的前端脚手架](https://github.com/vueComponent/ant-design-vue-pro)     |
| [Ant Design Vue-开箱即用的高质量Vue组件](https://github.com/vueComponent/ant-design-vue) |
| [Axios 基于 promise 的 HTTP 库](https://github.com/axios/axios)                          |
