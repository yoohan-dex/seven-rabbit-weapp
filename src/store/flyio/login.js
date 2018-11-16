import wxp from 'minapp-api-promise'
import request from './request'
import session from './sessionStore'
import {
  WX_HEADER_SKEY,
  ERR_WX_LOGIN_FAILED,
  WX_HEADER_CODE,
  ERR_LOGIN_FAILED
} from './constants'

const doLogin = async headers => {
  try {
    const res = await request('login')({
      headers
    })
    session.set(res.skey)
    return res
  } catch (e) {
    throw new Error(ERR_LOGIN_FAILED)
  }
}

export default async () => {
  const headers = {
    [WX_HEADER_SKEY]: session.get() || ''
  }
  try {
    console.log('?')
    await wxp.checkSession()
    const user = await request('getUser')({ headers })
    return user
  } catch (e) {
    console.log('ooo')
    session.clear()
    delete headers[WX_HEADER_SKEY]
    try {
      const { code } = await wxp.login()
      headers[WX_HEADER_CODE] = code
    } catch (e) {
      throw new Error(ERR_WX_LOGIN_FAILED)
    }
    return await doLogin(headers)
  }
}
