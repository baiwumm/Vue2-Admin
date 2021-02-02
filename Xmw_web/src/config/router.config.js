import { UserLayout, BasicLayout, PageView } from '@/layouts'
import { Menu } from '@/api/system'
import iconfont from '@/core/icons'
const RouteView = {
    name: 'RouteView',
    render: (h) => h('router-view')
}
// 前端路由表
const constantRouterComponents = {
    // 基础页面 layout 必须引入
    BasicLayout: BasicLayout,
    RouteView: RouteView,
    PageView: PageView
}

// 前端未找到页面路由（固定不用改）
export const notFoundRouter = {
    path: '*', redirect: '/404', hidden: true
}
// 静态路由(写死的路由)
const staticRouter =
// 字典子页
{
    path: '/subDictionary',
    name: 'subDictionary',
    redirect: '/system/dictionary',
    component: RouteView,
    meta: { title: 'menu.system.dictionary', keepAlive: true, icon: 'pushpin' },
    hidden: true,
    children: [{
        path: 'category/:DictionaryID(\\d+)',
        name: 'category',
        component: () => import('@/views/system/subDictionary'),
        meta: { title: 'menu.system.subDictionary', keepAlive: true, icon: 'pushpin' },
    }]
}
const generator = () => {
    return new Promise((resolve, reject) => {
        Menu().then(res => {
            let result = res.result
            let asyncRouters = result.map(item => {
                const currentRouter = {
                    ID: item.ID,
                    parentId: item.parentId,
                    path: item.path,
                    // 路由名称，建议唯一
                    name: item.name,
                    // 该路由对应页面的 组件 :方案2 (动态加载)
                    // component: (constantRouterComponents[item.component]) || (() => import(`@/views/${item.component}`)),
                    component: (constantRouterComponents[item.component]) || ((resolve) => require([`@/views/${item.component}`], resolve)
                    ),
                    hidden: item.hidden,
                    // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
                    meta: {
                        title: item.title,
                        icon: iconfont[item.icon] || item.icon,
                        permission: [item.permission],
                        keepAlive: item.keepAlive ? true : false,
                        hidden: item.hidden ? true : false,
                        target: reg.test(item.path) ? '_blank' : ''
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
                    currentRouter.children = generator(item.children, currentRouter)
                }
                return currentRouter
            })
            let routerList = treeData(asyncRouters, 'ID', 'parentId', 'children')
            routerList[0].children.push(staticRouter)
            resolve(routerList)
        }).catch(err => {
            reject(err)
        })
    })
}
export const asyncRouterMap = generator()

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
                component: () => import('@/views/user/Login')
            }
        ]
    },
    {
        path: '/lock',
        name: 'lock',
        component: () => import('@/views/user/Lock')
    },
    {
        path: '/404',
        component: () => import('@/views/exception/404')
    }

]

/**
         * 数组转树形结构
         * @param source 源数组
         * @param tree 树
         * @param parentId 父ID
         */
const treeData = (source, id, parentId, children) => {
    // let temp = JSON.parse(JSON.stringify(source))
    // 以id为键，当前对象为值，存入一个新的对象中
    let tempObj = {}
    for (let i in source) {
        tempObj[source[i][id]] = source[i]
    }
    return source.filter((father) => {
        // 把当前节点的所有子节点找到
        let childArr = source.filter((child) => father[id] == child[parentId])
        childArr.length > 0 ? (father[children] = childArr) : ''
        // 只返回第一级数据；如果当前节点的fatherId不为空，但是在父节点不存在，也为一级数据
        return father[parentId] === null || !tempObj[father[parentId]]
    })
}
// 判断路由是否是外链(即判断path是否是网址)
const reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/
