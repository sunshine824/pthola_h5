import {post, get} from './fetch'

/**
 * 微信授权获取code
 * @param redirect_uri  回调url
 * @param params
 * @returns {Promise<T>}
 */
export function getWeChatCode(params) {
  const result = get('api/2.0.0/connect.oauth2.authorize', params)
  return result
}

/**
 * 学员添加约课
 * @param params
 * @returns {*}
 */
export function addCourse(params) {
  const result = post('api/2.0.0/add.about',params)
  return result
}
