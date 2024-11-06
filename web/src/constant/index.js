/**
 * @description: 请求状态码
 */
export const RequestCode = {
  NoSuccess: -1, // 表示请求成功，但操作未成功
  Success: 200, // 表示请求成功
  BadRequest: 400, // 表示客户端发送的请求有错误
  Unauthorized: 401, // 表示客户端未提供身份验证凭据或身份验证凭据不正确
  NotFound: 404, // 表示服务器无法找到请求的资源
  Error: 500 // 表示服务器内部错误
}

/**
 * @description: 公共文案
 */
export const CommonText = {
  Yes: '是',
  No: '否',
  Null: '--'
}
