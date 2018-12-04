import Flyio from './interceptors'
import API from './apiUrl'
import Config from './config'
// 异常情况的错误处理
const errorFunction = (reqConfig, err) => {
  // 如果有异常需要提示
  if (!reqConfig.errorAction && reqConfig.isErrorDefaultTip) {
    setTimeout(() => {
      Config.resError.tipShow(err && err.response && err.response.data)
    }, 0)
  }
  throw err
}

let promises = [] // 接收接口请求的promise数组
let loadingTimer = [] // loading的定时器

// 接口请求封装函数
const handleRequest = (url = '', data = {}) => {
  let param = ''
  if (url.indexOf('/') !== -1) {
    const arr = url.split('/')
    url = arr[0]
    param = '/' + arr[1]
  }
  let _url = API[url] || ''
  return (flyConfig = {}, defaultTipConfig = {}) => {
    const test = {
      ...Config.flyConfig,
      ...Config.flyConfig.headers(),
      ...flyConfig
    }
    console.log('test', JSON.stringify(test))
    let flyio = Flyio.request(
      `https://www.hotbody.wang/${_url}${param}`,
      // `http://192.168.0.110:3000/${_url}${param}`,
      data,
      {
        ...Config.flyConfig,
        headers: Config.flyConfig.headers(),
        ...flyConfig
      }
    )
    let tipConfig = {
      ...Config.reqConfig,
      ...defaultTipConfig
    }

    // 开启loading
    clearTimeout(loadingTimer) // 多个接口时需要清除上一个loading
    loadingTimer = setTimeout(() => {
      tipConfig.isLoading && Config.loading.loadingShow()
    }, Config.loading.limitTime)

    // 计算当前的promise是否全部加载完成
    promises.push(flyio.catch(e => {}))
    Promise.all(promises)
      .then(data => {
        if (data.length !== promises.length) return
        promises = [] // 所有请求完后清除promise数组
        clearTimeout(loadingTimer) // 当请求在xxxms内完成则直接清除loading计时器
      })
      .catch(() => {
        promises = [] // 请求异常完后清除promise数组
        clearTimeout(loadingTimer) // 请求异常则直接清除loading计时器
      })

    return flyio
      .then(res => {
        // 成功返回
        if (res[Config.resSuccess.key] === Config.resSuccess.value) {
          tipConfig.isLoading && Config.loading.loadingHide() // 当promise全部加载完成则隐藏loading
          return res
        } else {
          errorFunction(tipConfig, res)
        }
      })
      .catch(err => {
        errorFunction(tipConfig, err)
      })
  }
}

export default handleRequest
