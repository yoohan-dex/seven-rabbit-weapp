import Vue from 'vue'
import * as R from 'ramda'
import { formatTime } from '../../utils'
import constants from '../flyio/constants'
import Session from '../flyio/sessionStore'
const state = {
  list: wx.getStorageSync('local-box') || [],
  products: [],
  boxes: [],
  share: {},
  shareProducts: []
}

const mutations = {
  saveItemToBox(state, payload) {
    if (state.list.length === 5) {
      return wx.showModal({
        title: '提示',
        content:
          '一次转发只允许添加5件产品，您可以打开收藏盒子将不想这次转发的去掉，再进行添加。转发过后会清空收藏盒子。',
        showCancel: false
      })
    }
    state.list = [...state.list, payload]
    wx.setStorageSync('local-box', state.list)
  },
  saveProductsToBox(state, payload) {
    const products = state.list.map(id => payload.filter(p => p.id === id)[0])
    state.products = products
  },
  removeItemFromBox(state, payload) {
    state.list = state.list.filter(v => v !== payload)
    console.log('state.list', state.list)
    wx.setStorageSync('local-box', state.list)
  },
  removeItemFromProducts(state, payload) {
    state.products = state.products.filter(p => p.id !== payload)
  },
  saveBoxes(state, payload) {
    const boxes = [...payload]
    state.boxes = boxes.sort((a, b) => b.id - a.id)
  },
  saveBox(state, payload) {
    const boxes = [...state.boxes, payload]
    state.boxes = boxes.sort((a, b) => b.id - a.id)
  },
  saveShare(state, payload) {
    state.share = payload
  },
  saveShareProducts(state, payload) {
    state.shareProducts = payload
  }
}

const actions = {
  async getBoxes({ commit }) {
    const boxes = await Vue.iBox.http('getBoxes')()
    commit('saveBoxes', boxes)
  },
  async getBoxById({ commit }, paylaod) {
    const box = await Vue.iBox.http(`getBox/${paylaod}`)()
    commit('saveShare', box)
  },
  async getProductsByIds({ state, commit }) {
    const products = await Vue.iBox.http('getProducts', {
      ids: state.list
    })()
    const avaliable = products.map(p => p.id)
    const unavaliable = R.difference(state.list, avaliable)
    unavaliable.forEach(un => commit('removeItemFromBox', un))
    commit('saveProductsToBox', products)
  },
  async createBox({ commit }, payload) {
    const box = await Vue.iBox.http('postBox', {
      products: payload,
      name: formatTime(new Date())
    })({
      method: 'post',
      headers: {
        [constants.WX_HEADER_SKEY]: (Session.get() && Session.get().skey) || ''
      }
    })
    commit('saveBox', box)
    return box
  },
  async getShareProducts({ commit }, payload) {
    const products = await Vue.iBox.http('getProducts', {
      ids: payload
    })()
    commit('saveShareProducts', products)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
