import router from './router'
import { resetRouter } from './router/index'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/util'
import { ACCESS_TOKEN, USER_INFO, IS_LOCK } from '@/store/mutation-types'
import { i18nRender } from '@/locales'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login'] // no redirect whitelist
const loginRoutePath = '/user/login' // 登录页
const defaultRoutePath = '/workbench' // 默认跳转主页
const lockPage = '/lock'  // 锁屏页

router.beforeEach((to, from, next) => {
    NProgress.start() // start progress bar
    to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`))
    let User_Info = storage.get(USER_INFO)
    if (User_Info) store.commit('SET_INFO', User_Info)
    /* 是否有token*/
    if (storage.get(ACCESS_TOKEN)) {
        if (storage.get(IS_LOCK) && to.path != lockPage) { //如果系统激活锁屏，全部跳转到锁屏页
            next({ path: lockPage })
            NProgress.done()
        }
        else if (to.path === loginRoutePath || (to.path === lockPage && !storage.get(IS_LOCK))) {
            next({ path: defaultRoutePath })
            NProgress.done()
        } else {
            // check login user.roles is null
            if (store.getters.roles.length === 0) {
                // request login userInfo
                store
                    .dispatch('GetInfo')
                    .then(res => {
                        const roles = res && res.role
                        // generate dynamic router
                        store.dispatch('GenerateRoutes', { roles }).then(() => {
                            // 根据roles权限生成可访问的路由表
                            // 动态添加可访问路由表
                            resetRouter()
                            router.addRoutes(store.getters.addRouters)
                            // 请求带有 redirect 重定向时，登录自动重定向到该地址
                            const redirect = decodeURIComponent(from.query.redirect || to.path)
                            if (to.path === redirect) {
                                // set the replace: true so the navigation will not leave a history record
                                next({ ...to, replace: true })
                            } else {
                                // 跳转到目的路由
                                next({ path: redirect })
                            }
                        })
                    })
                    .catch((error) => {
                        notification.error({
                            message: '错误',
                            description: '请求用户信息失败，请重试'
                        })
                        // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
                        store.dispatch('Logout').then(() => {
                            next({ path: loginRoutePath, query: { redirect: to.fullPath } })
                        })
                    })
            } else {
                next()
            }
        }
    } else {
        if (whiteList.includes(to.name)) {
            // 在免登录白名单，直接进入
            next()
        } else {
            // 如果从锁屏页退出，则不带参数
            if (to.path == lockPage) {
                next({ path: loginRoutePath })
            } else {
                next({ path: loginRoutePath, query: { redirect: to.fullPath } })
            }

            NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
        }
    }
})

router.afterEach(() => {
    NProgress.done() // finish progress bar
})
