English | [简体中文](./README.md)

<p align="center"><img width="100" src="https://ali-oss.xmwpro.com/project/vue2-admin/logo.svg!cyan" alt="Vue2 Admin"></p>

<h1 align="center">Vue2 Admin</h1>

<p align="center">
  <a href="https://github.com/vuejs/vue/" target="_blank">
    <img src="https://ali-oss.xmwpro.com/project/vue2-admin/shield/vue.svg!cyan" alt="vue">
  </a>
  <a href="https://github.com/vueComponent/ant-design-vue/" target="_blank">
    <img src="https://ali-oss.xmwpro.com/project/vue2-admin/shield/antd.svg!cyan" alt="Ant Design of Vue">
  </a>
  <a href="https://github.com/eggjs/egg/" target="_blank">
    <img src="https://ali-oss.xmwpro.com/project/vue2-admin/shield/egg.svg!cyan" alt="egg">
  </a>
  <a href="https://github.com/sequelize/sequelize/" target="_blank">
    <img src="https://ali-oss.xmwpro.com/project/vue2-admin/shield/socket.svg!cyan" alt="sequelize">
  </a>
  <a>
    <img src="https://ali-oss.xmwpro.com/project/vue2-admin/shield/build.svg!cyan">
  </a>
</p>

## Project Description

[Vue2 Admin](https://vue2.xmwpro.com/) is a background management system solutions, It is based on [Vue2.0](https://github.com/vuejs/vue/) and [Ant Design Vue Pro](https://github.com/vueComponent/ant-design-vue-pro/). It uses the latest front-end technology stack and provides rich functional components. I hope this project can help you.

- 😝 Online Preview: https://vue2.xmwpro.com

- 🔑 username：**admin**，password：**123456**

- 📄 Document Address：**In the works！**

- 🔗 Backend Portal：[Xmw_server](../Xmw_server)

- ❤️ star：**If possible, please give me a STAR to show my encouragement to the author. Thank you very much!**

## Environment and Dependencies

- node
- yarn
- webpack
- @vue/cli

> The [YARN](https://yarnpkg.com/) package management tool is recommended for this project

## Project Running

- Pull the project code
```bash
git clone https://github.com/Cyan-Xmw/Vue2-Admin.git
cd Vue2-Admin
cd Xmw_web
```

- Install dependencies
```
yarn install
```

- Development mode running
```
yarn run serve
```

- Compile the project
```
yarn run build
```

## The Directory Structure

```
├── src/
    ├── api(Used to place the service API interface)
    ├── assets(Used to place local static resources)
    ├── components(Used to place business common components)
    ├── config(Project basic configuration, including routing, global Settings)
    ├── core(Project bootstrap, global configuration initialization, dependency package introduction, etc)
    ├── layouts(Project Common Layout)
    ├── locales(International resources)
    ├── router(Vue-Router)
    ├── store(Vuex)
    ├── utils(Utility class)
    ├── views(Business page entry and common templates)
    ├── App.vue(Vue Template entry)
    ├── main.js(Vue Entry JS)
    ├── permission.js(Routing guard (routing permission control))
    ├── global.less(Global style)
```

## Function Module

```
- Login / Logout

- Workbench

- Integrated Components
  - Advanced Form
  - Announcements
  - Organizational Structure
  - Advanced Table
  - Advanced Dtails

- Personal Center

- System Settings
  - List of Users
  - Menu Management
  - Role Management
  - Permission Management
  - Operation Log
  - Dictionary Management

- Function Page
  - Generate QR Code
  - Rich Text Editor
  - Custom VUE Directives
  - Image Recognition
  - Chat Room
  - Waterfall Flow
  - Music Player
  - Video Player
  - Lazy Loading

- Tool Page
  - Picture Effect
  - Embedded Routers
  - Verification Code
  - Guide Page
  - Outer Chain
  - Credit Card Form
```

## Demo Figure

| ![](https://ali-oss.xmwpro.com/project/vue2-admin/demo/xmw-demo-1.jpg!cyan) | ![](https://ali-oss.xmwpro.com/project/vue2-admin/demo/xmw-demo-2.jpg!cyan) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![](https://ali-oss.xmwpro.com/project/vue2-admin/demo/xmw-demo-3.jpg!cyan) | ![](https://ali-oss.xmwpro.com/project/vue2-admin/demo/xmw-demo-4.jpg!cyan) |
| ![](https://ali-oss.xmwpro.com/project/vue2-admin/demo/xmw-demo-5.jpg!cyan) | ![](https://ali-oss.xmwpro.com/project/vue2-admin/demo/xmw-demo-6.jpg!cyan) |
| ![](https://ali-oss.xmwpro.com/project/vue2-admin/demo/xmw-demo-7.jpg!cyan) | ![](https://ali-oss.xmwpro.com/project/vue2-admin/demo/xmw-demo-8.jpg!cyan) |
| ![](https://ali-oss.xmwpro.com/project/vue2-admin/demo/xmw-demo-9.jpg!cyan) | ![](https://ali-oss.xmwpro.com/project/vue2-admin/demo/xmw-demo-10.jpg!cyan) |

## Special Thanks（Thanks to the giant）

| Project                                                          |
| ---------------------------------------------------------------- |
| [Vue2.0 Build an incremental framework for the user interface](https://github.com/vuejs/vue)                              |
| [Ant Design Vue Pro Front-end scaffolding based on ANTD VUE](https://github.com/vueComponent/ant-design-vue-pro)     |
| [Ant Design Vue-High quality VUE components right out of the box](https://github.com/vueComponent/ant-design-vue) |
| [Axios Promise-based HTTP library](https://github.com/axios/axios)   |
