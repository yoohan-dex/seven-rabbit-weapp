import Fly from 'flyio'
// import store from '@/store'
// import loginApi from './login'
const request = new Fly()

request.interceptors.request.use(request => {
  return request
})

request.interceptors.response.use(
  (response, promise) => {
    return promise.resolve(response.data)
  },
  (err, promise) => {
    // if (err.response.status === 401) {
    //   loginApi({
    //     force: true,
    //     success(user) {
    //       store.commit('global/saveUser', user)
    //       store.dispatch('box/getBoxes')
    //     }
    //   })
    // }
    // console.log('err', err)
    return promise.reject(err)
  }
)
export default request
