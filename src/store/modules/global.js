import Vue from 'vue'
import loginApi from '../flyio/login'
import wxp from 'minapp-api-promise'

const state = {
  userId: '',
  userInfo: '',
  systemInfo: '',
  isX: false,
  isAdmin: ''
}

const mutations = {
  saveUser(state, payload) {
    state.userInfo = payload.userInfo
    state.userId = payload.id
    state.isAdmin = payload.roles.includes('admin')
  },
  saveInfo(state, payload) {
    state.userInfo = payload
  },
  saveSystemInfo(state, info) {
    state.systemInfo = info
    if (info.screenHeight > 800) {
      state.isX = true
    }
    console.log(info)
  }
}

const actions = {
  async login({ commit }, payload = {}) {
    const res = await loginApi({
      force: payload.force
    })
    commit('saveUser', res)
  },
  async decryptPhone(_, payload) {
    const phone = await Vue.iBox.http('decryptPhone', payload)({
      method: 'post'
    })
    return `${phone}`
  },

  async getBindPhoneCode(_, payload) {
    await Vue.iBox.http('getBindPhoneCode', payload)()
  },
  async getSystemInfo({ commit }) {
    const info = await wxp.getSystemInfo()
    commit('saveSystemInfo', info)
  },
  async getUser({ commit }) {
    const user = await Vue.iBox.http('getUser')()
    commit('saveUser', user)
  },
  async saveUserInfo(_, payload) {
    await Vue.iBox.http('saveUserInfo', payload)({ method: 'post' })
  },
  async savePhone(_, payload) {
    await Vue.iBox.http('bindPhone', payload)({ method: 'post' })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
