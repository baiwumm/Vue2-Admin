import storage from 'store'
import router from '@/router'
import { login, logout } from '@/api/login'
import { ACCESS_TOKEN, USER_INFO, SET_LOCK_PASSWD, IS_LOCK, LOCK_PATH } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
    state: {
        token: '',
        name: '',
        welcome: '',
        avatar: '',
        roles: [],
        info: {},
        lockPasswd: storage.get(SET_LOCK_PASSWD) || '',
        isLock: storage.get(IS_LOCK) || false,
        lockPath: ''
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, { name, welcome }) => {
            state.name = name
            state.welcome = welcome
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_INFO: (state, info) => {
            state.info = info
        },
        SET_LOCK_PASSWD: (state, lockPasswd) => {
            state.lockPasswd = lockPasswd
            state.lockPath = router.app._route.path
            storage.set(SET_LOCK_PASSWD, lockPasswd)
            storage.set(LOCK_PATH, router.app._route.path)
        },
        SET_LOCK: (state) => {
            state.isLock = true
            storage.set(IS_LOCK, true)
        },
        CLEAR_LOCK: (state) => {
            state.isLock = false;
            state.lockPasswd = '';
            state.lockPath = ''
            storage.set(IS_LOCK, false)
            storage.set(SET_LOCK_PASSWD, '')
            storage.set(LOCK_PATH, '')
        }
    },

    actions: {
        // 登录
        Login({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                login(userInfo).then(response => {
                    if (response.state == 1) {
                        const result = response.result
                        result.label = JSON.parse(result.label)
                        result.department = JSON.parse(result.department)
                        result.SectorJobs = JSON.parse(result.SectorJobs)
                        result.address = JSON.parse(result.address)
                        storage.set(ACCESS_TOKEN, result.token)
                        storage.set(USER_INFO, result)
                        commit('SET_TOKEN', result.token)
                        commit('SET_INFO', result)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        GetInfo({ commit }) {
            return new Promise((resolve, reject) => {
                const result = user.state.info
                if (result.role && result.role.permissions.length > 0) {
                    const role = result.role
                    role.permissions = result.role.permissions
                    role.permissions.map(per => {
                        if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                            const action = per.actionEntitySet.map(action => { return action.action })
                            per.actionList = action
                        }
                    })
                    role.permissionList = role.permissions.map(permission => { return permission.permissionId })
                    commit('SET_ROLES', result.role)
                } else {
                    reject(new Error('没有路由权限 !'))
                }

                commit('SET_NAME', { name: result.CnName, welcome: welcome() })
                commit('SET_AVATAR', result.avatar)

                resolve(result)
            })
        },

        // 登出
        Logout({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout().then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    storage.remove(ACCESS_TOKEN)
                    storage.remove(USER_INFO)
                    storage.remove(SET_LOCK_PASSWD)
                    storage.remove(IS_LOCK)
                    storage.remove(LOCK_PATH)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        }

    }
}

export default user
