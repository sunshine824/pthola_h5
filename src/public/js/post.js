import {serveUrl} from './config'
import qs from 'qs'

/**
 * 封装post请求
 * @param url     请求接口
 * @param params  请求参数
 * @returns {*}
 */
export function post(url, params) {
  return _this.$http({
    method: 'post',
    url: serveUrl + '/' + url,
    data: qs.stringify(params)
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
