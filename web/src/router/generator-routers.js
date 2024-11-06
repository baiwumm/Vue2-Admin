import { get } from 'lodash-es'

import { getDynamicRoutes } from '@/api/auth'
import MenuIcon from '@/core/icons'
import { BasicLayout, BlankLayout, PageView, RouteView } from '@/layouts'

// 前端路由表 (基于动态)
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,

  403: () => import('@/views/exception/403'),
  404: () => import('@/views/exception/404'),
  500: () => import('@/views/exception/500'),

  Workbench: () => import('@/views/workbench')
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*',
  redirect: '/404',
  hidden: true
}

// 根级菜单
const rootRouter = {
  name: 'index',
  path: '/',
  component: 'BasicLayout',
  redirect: '/workbench',
  meta: {
    title: 'menu.workbench'
  },
  children: [
    // 首页
    {
      path: '/workbench',
      name: 'workbench',
      component: 'Workbench',
      meta: { title: 'menu.workbench', keepAlive: false, icon: MenuIcon['WorkbenchIcon'], permission: ['workbench'] }
    }
  ]
}

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = (token) => {
  return new Promise((resolve, reject) => {
    getDynamicRoutes(token)
      .then((res) => {
        const result = get(res, 'data', [])
        const menuNav = []
        rootRouter.children.push(...result)
        menuNav.push(rootRouter)
        const routers = generator(menuNav)
        routers.push(notFoundRouter)
        resolve(routers)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap) => {
  return routerMap.map((item) => {
    const { title, hiddenHeaderContent, keepAlive, icon } = item.meta || {}
    // 判断路由是否是外链(即判断path是否是网址)
    const httpReg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path,
      // 路由名称，建议唯一
      name: item.name,
      // 该路由对应页面的 组件 :方案1
      // component: constantRouterComponents[item.component || item.key],
      // 该路由对应页面的 组件 :方案2 (动态加载)
      component: constantRouterComponents[item.component] || (() => import(`@/views/${item.component}`)),

      hidden: item.hidden,
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: title,
        icon: MenuIcon[icon] || icon || undefined,
        hiddenHeaderContent: hiddenHeaderContent,
        keepAlive,
        target: httpReg.test(item.path) ? '_blank' : undefined,
        permission: item.name
      }
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children)
    }
    return currentRouter
  })
}
