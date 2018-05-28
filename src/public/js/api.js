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
  const result = post('api/2.0.0/add.about', params)
  return result
}

/**
 * 获取约课列表
 * @param params
 * @returns {*}
 */
export function getBookList(params) {
  const result = post('api/2.0.0/lists.h5', params)
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
