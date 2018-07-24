import {post, get} from './fetch'
import {serveUrl} from './config'

/**
 * 微信授权获取code
 * @param redirect_uri  回调url
 * @param params
 * @returns {Promise<T>}
 */
export function getWeChatCode(url) {
  const result = serveUrl + '/api/2.0.0/connect.oauth2.authorize?redirect_uri=' + url + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
  return result
}

/**
 * 学员微信登录获取token
 * @param params
 * @returns {*}
 */
export function wxStudentLogin(params) {
  const result = post('api/2.0.0/student.web.login', params)
  return result
}

/**
 * 学员添加约课
 * @param params
 * @returns {*}
 */
export function addCourse(params) {
  const result = post('api/2.0.0/add.about', params)
  return result
}

/**
 * 发送验证码
 * @param params
 * @returns {*}
 */
export function sendVerifyCode(params) {
  const result = post('api/2.0.0/phone.verify.code', params)
  return result
}

/**
 * 获取总约课列表
 * @param params
 * @returns {*}
 */
export function getBookList(params) {
  const result = post('api/2.0.0/lists.h5', params)
  return result
}

/**
 * 获取已同意约课列表（包括休息占位）
 * @param params
 * @returns {*}
 */
export function getYetBookList(params) {
  const result = post('api/2.0.0/no.logo.lists.h5', params)
  return result
}

/**
 * 修改学员约课
 * @param params
 * @returns {*}
 */
export function editCourse(params) {
  const result = post('api/2.0.0/edit.about', params)
  return result
}

/**
 * 微信分享
 * @param params
 * @returns {*}
 */
export function wxShare(params) {
  const result = post('api/2.0.0/wechat.config',params)
  return result
}
