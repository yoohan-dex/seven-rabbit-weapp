// API
const API = {
  // 公共服务
  login: 'auth/weapp/login',
  getUser: 'auth/weapp/user',
  saveUserInfo: 'auth/weapp/userInfo',
  decryptPhone: 'auth/weapp/decryptPhone',
  bindPhone: 'auth/weapp/bindphone',
  getBindPhoneCode: 'auth/weapp/bindPhoneCode',
  'globalUrl.getProvince':
    'https://h5-dev.iboxpay.com/hzui/static/data/province.json' // 获取省市
}

export default API
