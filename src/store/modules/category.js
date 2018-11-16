import Vue from 'vue'
export const MUTATE_TYPE = 'MUTATE_TYPE'

const state = {
  select: '',
  list: []
}

const mutations = {
  SAVE_LIST: (state, payload) => {
    state.select = payload[0].id
    state.list = payload.map(c => ({
      ...c,
      filters: c.filters.map(f => ({
        ...f,
        single: f.features.length === 0,
        selected: false,
        features: f.features.map(feature => ({
          ...feature,
          selected: false
        }))
      }))
    }))
  },

  INI_FEATURE: state => {
    state.list = state.list.map(c => ({
      ...c,
      filters: c.filters.map(f => ({
        ...f,
        features: f.features.map(feature => ({
          ...feature,
          selected: false
        }))
      }))
    }))
  },

  SELECT: (state, payload) => {
    state.select = payload
  },
  [MUTATE_TYPE](state, payload) {
    const list = state.list
    list.filter(c => c.id === state.select)[0].filters = payload
    state.list = list
  }
}

const actions = {
  async getCategory({ commit, dispatch }, params = {}) {
    const res = await Vue.iBox.http('getCategory', params)()
    commit('SAVE_LIST', res)
    if (params.ini) {
      console.log('??')
      console.log(res)
      dispatch('product/regetProducts', { category: res[0].id }, { root: true })
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
