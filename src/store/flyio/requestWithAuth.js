import request from './request'
import session from './session'
import { WX_HEADER_SKEY } from './constants'

export default (url, params) => async config => {
  config.headers = {
    ...config.headers,
    [WX_HEADER_SKEY]: session.get() || ''
  }
  const res = await request(url, params)(config)
  return res
}
