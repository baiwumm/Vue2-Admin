import storage from 'store'
import expirePlugin from 'store/plugins/expire'

import { getUserInfo, login, logout } from '@/api/auth'
import { ACCESS_TOKEN, USER_INFO } from '@/store/mutation-types'

storage.addPlugin(expirePlugin)
const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    userInfo: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      storage.set(ACCESS_TOKEN, token, new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
    },
    SET_NAME: (state, { name }) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.userInfo = info
      storage.set(USER_INFO, info)
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then((response) => {
            if (response.code === 200) {
              const result = response.data
              commit('SET_TOKEN', result.token)
            }
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        // 请求后端获取用户信息 /api/user/info
        getUserInfo()
          .then((response) => {
            const { data } = response
            if (data.role && data.role.permissions.length > 0) {
              const role = { ...data.role }
              role.permissionList = role.permissions.map((permission) => {
                return permission.permissionId
              })
              // 覆盖响应体的 role, 供下游使用
              data.role = role
              commit('SET_ROLES', role)
              commit('SET_INFO', data)
              commit('SET_NAME', { name: data.cnName })
              commit('SET_AVATAR', data.avatar)
              // 下游
              resolve(data)
            } else {
              reject(new Error('getInfo: roles must be a non-null array !'))
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token)
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            commit('SET_INFO', {})
            commit('SET_ROUTERS', [])
            storage.remove(ACCESS_TOKEN)
            storage.remove(USER_INFO)
            resolve()
          })
          .catch((err) => {
            console.log('logout fail:', err)
            // resolve()
          })
          .finally(() => {})
      })
    }
  }
}

export default user
