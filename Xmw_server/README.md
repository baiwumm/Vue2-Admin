English | [简体中文](./README.zh-CN.md)

<p align="center"><img width="100" src="https://xmwpro.oss-cn-beijing.aliyuncs.com/vue-admin-xmw-pro/logo.svg" alt="Vue-Admin-Xmw-Pro Logo"></p>

<h1 align="center">Vue-Admin-Xmw-Pro</h1>

<p align="center">
  <a href="https://github.com/eggjs/egg/" target="_blank">
    <img src="https://xmwpro.oss-cn-beijing.aliyuncs.com/vue-admin-xmw-pro/egg.svg" alt="egg">
  </a>
  <a href="https://github.com/eggjs/egg-redis/" target="_blank">
    <img src="https://xmwpro.oss-cn-beijing.aliyuncs.com/vue-admin-xmw-pro/redis.svg" alt="egg-redis">
  </a>
  <a href="https://github.com/eggjs/egg-socket.io/" target="_blank">
    <img src="https://xmwpro.oss-cn-beijing.aliyuncs.com/vue-admin-xmw-pro/socket.svg" alt="egg-socket.io">
  </a>
  <a href="https://github.com/auth0/node-jsonwebtoken/" target="_blank">
    <img src="https://xmwpro.oss-cn-beijing.aliyuncs.com/vue-admin-xmw-pro/token.svg" alt="jsonwebtoken">
  </a>
  <a href="https://github.com/sequelize/sequelize/" target="_blank">
    <img src="https://xmwpro.oss-cn-beijing.aliyuncs.com/vue-admin-xmw-pro/socket.svg" alt="sequelize">
  </a>
  <a>
    <img src="https://xmwpro.oss-cn-beijing.aliyuncs.com/vue-admin-xmw-pro/build.svg">
  </a>
</p>

## Project Description

[vue-admin-xmw-pro] (http://www.xmwpro.com/) is a background management system solutions, The back-end is based on [egg.js](https://github.com/eggjs/egg/) and [sequelize](https://github.com/sequelize/sequelize/). It uses the latest technology stack and provides rich functional components. I hope this project can help you.

- 😝 Online Preview: http://www.xmwpro.com

- 📄 Document Address：**In the works！**

- 🔗 Front Gate：[Xmw_web](../Xmw_web)

- ❤️ star：**If possible, please give me a STAR to show my encouragement to the author. Thank you very much!**

## Environment and Dependencies

- node
- yarn

> The [YARN](https://yarnpkg.com/) package management tool is recommended for this project

## Project Running

- Pull the project code
```bash
git clone https://github.com/FollowTrend/vue-admin-xmw-pro.git
cd vue-admin-xmw-pro
cd Xmw_server
```

- Install dependencies
```
yarn install
```

- Development mode running
```
yarn run dev
```

## The Directory Structure

```
├── app/
    ├── controller(Used to parse the user's input)
    ├── extend(Extensions to the framework)
    ├── io(Egg-Socket. IO framework configuration)
    ├── middleware( Used to write middleware)
    ├── public(Used to place static resources)
    ├── service(Used to write the business logic layer)
    ├── router.js(Used to configure URL routing rules)
├── config/
    ├── config.{env}.js(Used to write configuration files)
    ├── plugin.js(Used to configure the plug-in that needs to be loaded)
```


## Special Thanks（Thanks to the giant）

| Project                                                          |
| ---------------------------------------------------------------- |
| [egg.js Designed for enterprise-class frameworks and applications](https://github.com/eggjs/egg)                              |
| [egg-socket.io enables real-time, bidirectional and event-based communication between the browser and the server](https://github.com/eggjs/egg-socket.io)     |
| [jsonwebtoken A solution to implement Token technology](https://github.com/auth0/node-jsonwebtoken) |
| [sequelize Orm framework](https://github.com/sequelize/sequelize)                          |
