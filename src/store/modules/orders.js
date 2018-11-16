import Vue from 'vue'

const state = {
  orders: '',
  orderDetail: '',
  pending: false,
  express: '',
  expressPending: false,
  msg: '',
  allOrders: []
}

const mutations = {
  saveOrders(state, payload) {
    state.orders = payload
    state.msg = ''
  },
  saveAllOrders(state, payload) {
    state.allOrders = payload
    state.msg = ''
  },
  saveOrderDetail(state, payload) {
    state.orderDetail = payload
  },
  clear(state) {
    state.orderDetail = ''
  },

  setMsg(state, msg) {
    state.msg = msg
  },
  pending(state, bool) {
    state.pending = bool
  },
  expressPending(state, bool) {
    state.expressPending = bool
  },
  saveExpressData(state, payload) {
    state.express = payload
  }
}

const actions = {
  async getOrders({ commit }) {
    try {
      const orders = await Vue.iBox.http('getOrders')()
      commit('saveOrders', orders)
    } catch (err) {
      const { statusCode, message } = err.response.data
      commit('setMsg', message)
      if (statusCode === 420) {
        throw new Error(message)
      }
    }
  },

  async getIssueReason() {
    return await Vue.iBox.http('issueReason')()
  },
  async setIssus({ commit }, payload) {
    const order = await Vue.iBox.http('issueControl', payload)({
      method: 'post'
    })
    commit('saveOrderDetail', order)
  },
  async finishOrder({ commit }, payload) {
    const order = await Vue.iBox.http('orderFinish', payload)()
    commit('saveOrderDetail', order)
  },
  async getDetail({ commit }, id) {
    const order = await Vue.iBox.http('getOrderDetail', { id })()
    console.log('order', order)
    commit('saveOrderDetail', order)
  },
  async nextStep({ state, commit }, id) {
    if (state.pending) {
      return
    }
    commit('pending', true)
    console.log('next')
    console.log('id', id)
    const order = await Vue.iBox.http('orderNextStep', { id })()
    commit('saveOrderDetail', order)
    commit('pending', false)
  },

  async backStep({ state, commit }, id) {
    if (state.pending) {
      return
    }
    commit('pending', true)
    const order = await Vue.iBox.http('orderBackStep', { id })()
    commit('saveOrderDetail', order)
    commit('pending', false)
  },

  async commitExpress({ commit, dispatch }, payload) {
    const order = await Vue.iBox.http('commitExpress', payload)({
      method: 'post'
    })
    commit('saveOrderDetail', order)
    dispatch('checkExpress', order.id)
  },

  async setPaymentStatus({ state, commit }, payload) {
    if (state.pending) return
    commit('pending', true)
    const order = await Vue.iBox.http('setPaymentStatus', payload)({
      method: 'post'
    })
    commit('saveOrderDetail', order)
    commit('pending', false)
  },

  async checkExpress({ state, commit }, payload) {
    if (state.expressPending) return
    commit('expressPending', true)
    const res = await Vue.iBox.http('checkExpress', payload)()
    commit('expressPending', false)
    commit('saveExpressData', res)
  },
  async search({ commit }, query) {
    try {
      const orders = await Vue.iBox.http('search', query)()
      commit('setMsg', '')
      commit('saveAllOrders', orders)
    } catch (err) {
      const { statusCode, message } = err.response.data
      commit('setMsg', message)
      if (statusCode === 403) {
        commit('setMsg', '当前没有权限查看订单')
      }
      if (statusCode === 420) {
        throw new Error(message)
      }
    }
  },
  async setCost({ commit }, payload) {
    if (state.pending) {
      return
    }
    commit('pending', true)
    const order = await Vue.iBox.http('cost', payload)({ method: 'post' })
    commit('saveOrderDetail', order)
    wx.showToast({
      title: '更新单件成本成功',
      icon: 'none'
    })
    commit('pending', false)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
