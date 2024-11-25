<p align="center"><img width="100" src="./web//src/assets/logo.svg" alt="Vue2 Admin"></p>
<h1 align="center">Vue2 Admin</h1>
<p align="center">前端的全栈之路</p>

## ☘️ 项目简介
[Vue2 Admin](https://vue2.baiwumm.com/) 是一个前端基于 [Ant Design Pro](https://github.com/vueComponent/ant-design-vue-pro) 二次开发，后端基于 [Nest.js](https://nestjs.com/) 的全栈后台应用，适合学习全栈开发的同学参考学习。

- 🍁 前端技术栈： [Vue2](https://v2.cn.vuejs.org/)、[Ant Design Vue](https://1x.antdv.com/docs/vue/introduce-cn/)、[Vuex](https://vuex.vuejs.org/zh/)


- 🍁 后端技术栈： [Nest.js](https://nestjs.com/)、[PostgreSQL](https://www.postgresql.org/)、[Prisma](https://prisma.yoga/)

- 🍂 线上预览： https://vue2.baiwumm.com/

- 🍃 用户名：**Admin**，密码：**abc123456**

- [🪹 github 仓库地址](https://github.com/baiwumm/vue2-admin/)

- [🪺 码云仓库地址](https://gitee.com/baiwumm/vue2-admin/)

- [🍀 Swagger 接口文档](https://vue2.baiwumm.com/docs)

- ❤️ star：**如果可以的话，请顺手给个star，表示对作者的鼓励，万分感谢！**

## 🌿 系统功能设计
1. 动态国际化语言配置
2. 记录登录用户的 `CURD` 操作日志
3. 用户和角色权限的一对一映射，根据角色关联的菜单权限生成动态路由菜单
4. 登录用户发布消息公告，后端使用 `SSE` 推送，可登录多个用户查看效果
5. 前端常见的一些实用的业务功能或者一些有趣的效果

## 🌳 环境和依赖
> 推荐本项目使用 [pnpm](https://github.com/pnpm/pnpm/) 包管理工具
- [Git](https://git-scm.com/) (你需要git来克隆和管理项目版本)
- [Node.js](https://nodejs.org/) (Node.js 版本要求 >= 18.12.0，推荐 18.19.0 或更高)
- [Pnpm](https://github.com/pnpm/pnpm/) (>= 8.7.0，推荐最新版本)
- [PostgreSQL](https://www.postgresql.org/) (推荐最新版本)

## 🌴 项目运行
1. 安装 [PostgreSQL](https://www.postgresql.org/) 数据库，并导入 `/postgreSQL` 中的文件，修改 `/server/env` 文件中的数据库配置，这一步要保证成功，不然后端服务起不来
```powershell
DATABASE_URL="postgresql://postgres:123456@localhost:5432/vue2-admin?schema=public"
```

2. 拉取项目代码
```powershell
git clone https://github.com/baiwumm/vue2-admin.git
cd vue2-admin
// 进入前端
cd web
// 进入后端
cd server
```

3. 安装依赖
```powershell
npm install -g pnpm
pnpm install
```

4. 开发模式运行
```powershell
// 前端启动
pnpm dev
// 后端启动：开发模式
pnpm start:dev
```

5. 编译项目
```powershell
pnpm build
```

## 🌵 新增路由菜单
1. 在 `web/src/views` 目录下新建 `文件夹/index.vue` 文件
2. 在菜单 `系统管理-国际化-menu` 中添加路由配置
3. 在菜单 `系统管理-菜单管理` 中按照规则添加菜单，可打开多个标签页参考，路由配置参考：[路由和菜单](https://pro.antdv.com/docs/router-and-nav)
4. 在菜单 `系统管理-角色管理` 中编辑状态中勾选相应的菜单，保存刷新页面，即可看到路由菜单生效

## 🌱 功能模块

```
- 登录 / 注销

- 工作台

- 智能行政
  - 消息公告
  - 组织管理
  - 岗位管理
  - 组织架构

- 个人中心

- 功能页
  - 验证码
  - 自定义 Vue 指令
  - 懒加载
  - 瀑布流
  - 图片预览
  - 拾色器
  - 图片取色盘
  - 系统级取色器
  - Swiper
  - 打印
  - 文件预览
  - 拖拽

- 技术文档
  - Vue2
  - Nest.js
  - Ant Design Vue
  - Ant Design Pro

- 系统设置
  - 用户管理
  - 菜单管理
  - 角色管理
  - 国际化
  - 操作日志

- 关于

```

## 🪴 演示图

| ![](./demo/1.png) | ![](./demo/2.png) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![](./demo/3.png) | ![](./demo/4.png) |
| ![](./demo/5.png) | ![](./demo/6.png) |
| ![](./demo/7.png) | ![](./demo/8.png) |
| ![](./demo/9.png) | ![](./demo/10.png) |
| ![](./demo/11.png) | ![](./demo/12.png) |
| ![](./demo/13.png) | ![](./demo/14.png) |

## 🍄 总结
1. 本项目没有经过严格的测试，有可能存在一定的 `Bug`。
2. 本项目仅供学习交流使用，请勿用于商业用途。
3. 欢迎提交 [Issues](https://github.com/baiwumm/vue2-admin/issues) 和 [PR](https://github.com/baiwumm/vue2-admin/pulls)，一起完善本项目。

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=baiwumm/vue2-admin&type=Date)](https://star-history.com/#baiwumm/vue2-admin&Date)