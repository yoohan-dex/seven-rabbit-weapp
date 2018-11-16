import constants from './constants'
const SESSION_KEY = 'weapp_session_' + constants.WX_SESSION_MAGIC_ID
let time = 0
export default {
  get() {
    time += 1
    console.log('time', time)
    const key = wx.getStorageSync(SESSION_KEY) || ''
    console.log(key)
    return key
  },

  set(session) {
    wx.setStorageSync(SESSION_KEY, session)
  },

  clear() {
    wx.removeStorageSync(SESSION_KEY)
  }
}
