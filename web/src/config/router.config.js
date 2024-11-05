// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import MenuIcon from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/home',
    children: [
      // 首页
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/index'),
        meta: { title: 'menu.home', keepAlive: true, icon: MenuIcon['HomeIcon'], permission: ['home'] }
      },
      // 系统设置
      {
        path: '/system-manage',
        name: 'system-manage',
        redirect: '/system-manage/internationalization',
        component: RouteView,
        meta: { title: 'menu.system-manage', keepAlive: true, icon: 'setting', permission: ['system-manage'] },
        children: [
          {
            path: '/system-manage/menu-manage',
            name: 'menu-manage',
            component: () => import('@/views/system-manage/menu-manage/index'),
            meta: {
              title: 'menu.system-manage.menu-manage',
              keepAlive: true,
              icon: 'menu',
              permission: ['menu-manage']
            }
          },
          {
            path: '/system-manage/internationalization',
            name: 'internationalization',
            component: () => import('@/views/system-manage/internationalization/index'),
            meta: {
              title: 'menu.system-manage.internationalization',
              keepAlive: true,
              icon: MenuIcon['InternationalizationIcon'],
              permission: ['internationalization']
            }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
