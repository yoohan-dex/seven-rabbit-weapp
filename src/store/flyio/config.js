import session from './sessionStore'
import { WX_HEADER_SKEY } from './constants'
let time = 0
export default {
  // 关于接口loading的配置
  loading: {
    limitTime: 200, // 接口请求在xxxms内完成则不展示loading
    loadingShow: () => {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
    },
    loadingHide: () => {
      wx.hideLoading()
    }
  },
  // 接口请求的默认配置
  reqConfig: {
    isLoading: false, // 是否展示loading，默认为true
    isErrorDefaultTip: true, // 是否展示默认错误提示，默认为true
    errorAction: false // 是否使用自定义的错误处理方法，默认为false，如设置true则需在views层catch错误
  },
  // fly的默认配置
  flyConfig: {
    method: 'get',
    headers: function() {
      time += 1
      console.log(time)
      return { [WX_HEADER_SKEY]: session.get() || '' }
    }
  },
  // 运行成功的判别标识  例如res.returnCode === '0'即成功
  resSuccess: {
    // key: 'returnCode', // 与后台规定的表示响应成功的变量
    // value: '0' // 与后台规定的表示响应成功code
  },
  // 异常情况
  resError: {
    // 异常默认提示的方法
    tipShow: err => {
      console.log('err', err)
      wx.showToast({
        title: (err && err.message) || '服务器升级中，请稍后重试。',
        icon: 'none',
        mask: true
      })
    }
  }
}
