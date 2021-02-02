
import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import router from '../router'
// 创建 axios 实例
const request = axios.create({
    // API 请求的默认前缀
    baseURL: process.env.VUE_APP_API_BASE_URL,
    withCredentials: true,
    timeout: 6000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
    if (error.response.data.state === 401) {
        authError('登录已失效,请重新登录!')
        store.dispatch('Logout').then(() => {
            router.push({ name: 'login' })
        })
    }
    return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
    const token = storage.get(ACCESS_TOKEN)
    // 如果 token 存在
    // 让每个请求携带自定义 token 请根据实际情况自行修改
    if (token) {
        config.headers['Access-Token'] = token
    }
    return config
}, errorHandler)

// 用户重复登录防抖操作
function debounce(fn, wait) {
    let timerId = null;
    let flag = true;
    return function () {
        clearTimeout(timerId);
        if (flag) {
            fn.apply(this, arguments);
            flag = false;
            timerId = setTimeout(() => {
                flag = true;
            }, wait);
        }
    };
}

const authError = debounce((msg) => {
    notification.error({
        message: '温馨提示!',
        description: msg,
        duration: 0
    })
}, 3000);
// response interceptor
request.interceptors.response.use((response) => {
    // 判断用户是否二次登录
    if (response.data.state === 102) {
        authError('此账号已在别的地方登陆，请联系管理员!')
        store.dispatch('Logout').then(() => {
            router.push({ name: 'login' })
        })
    }
    else if (response.data.state === 401) {
        authError('登录已失效,请重新登录!')
        store.dispatch('Logout').then(() => {
            router.push({ name: 'login' })
        })
    }
    else {
        return response.data
    }
}, errorHandler)

const installer = {
    vm: {},
    install(Vue) {
        Vue.use(VueAxios, request)
    }
}

export default request

export {
    installer as VueAxios,
    request as axios
}
