import request from '@/utils/request'

/**
 * @description: 用户登录
 */
export function login(parameter) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: parameter,
    skipErrorHandler: true
  })
}

/**
 * @description: 获取图形验证码
 */
export function generateVerifCode() {
  return request({
    url: '/auth/captcha',
    method: 'get'
  })
}

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return request({
    url: '/auth/getUserInfo',
    method: 'get'
  })
}

/**
 * @description: 注销登录
 */
export function logout() {
  return request({
    url: 'auth/logout',
    method: 'post'
  })
}

/**
 * @description: 获取国际化层级数据
 */
export function getLocales() {
  return request({
    url: 'auth/getLocales',
    method: 'get'
  })
}

/**
 * @description: 获取动态路由
 */
export function getDynamicRoutes() {
  return request({
    url: 'auth/getDynamicRoutes',
    method: 'get'
  })
}
