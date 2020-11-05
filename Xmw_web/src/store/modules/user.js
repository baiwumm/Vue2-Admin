import storage from 'store'
import { login, logout } from '@/api/login'
import { ACCESS_TOKEN, TOKEN_CREATETIME, TOKEN_EXPIRESIN, USER_INFO } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
const user = {
    state: {
        token: '',
        name: '',
        welcome: '',
        avatar: '',
        roles: [],
        info: {}
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
                        result.SectorJobs = JSON.parse(result.SectorJobs)
                        result.address = JSON.parse(result.address)
                        storage.set(ACCESS_TOKEN, result.token)
                        storage.set(TOKEN_CREATETIME, new Date().getTime())
                        storage.set(TOKEN_EXPIRESIN, result.expiresIn)
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
            return new Promise((resolve) => {
                logout().then(() => {
                    resolve()
                }).catch(() => {
                    resolve()
                }).finally(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    // commit("SET_ROUTERS", [], { root: true });
                    storage.remove(ACCESS_TOKEN)
                    storage.remove(TOKEN_CREATETIME)
                    storage.remove(TOKEN_EXPIRESIN)
                    storage.remove(USER_INFO)
                })
            })
        }

    }
}

export default user
