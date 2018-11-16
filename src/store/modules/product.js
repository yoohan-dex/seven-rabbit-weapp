import Vue from 'vue'

export const MUTATE_TYPE = 'MUTATE_TYPE'
export const TRIGGER_PANEL = 'TRIGGER_PANEL'
export const SAVE_LIST = 'SAVE_LIST'
export const APPEND_LIST = 'APPEND_LIST'
export const SELECT_FEATURE = 'SELECT_FEATURE'
export const SAVE_PARAMS = 'SAVE_PARAMS'
export const SAVE_CATEGORY = 'SAVE_CATEGORY'

const state = {
  loading: false,
  appending: false,
  got: false,
  page: 1,
  list: [],
  category: '',
  selectedFeatures: [],
  filterPanelShow: false
}

const mutations = {
  [SELECT_FEATURE](state, payload) {
    const selectedFeatures = []
    payload.forEach(filter => {
      filter.features.forEach(feature => {
        if (feature.selected) {
          selectedFeatures.push(feature.id)
        }
      })
    })
    state.selectedFeatures = selectedFeatures
  },
  [MUTATE_TYPE](state, payload) {
    state.type = payload
  },
  [TRIGGER_PANEL](state) {
    state.filterPanelShow = !state.filterPanelShow
    console.log('state.filterPanelShow', state.filterPanelShow)
  },
  [SAVE_LIST]: (state, payload) => {
    const list = payload.list.map(p => ({ ...p, image: p.cover }))

    state.list = list
    state.total = payload.total
  },
  [APPEND_LIST]: (state, payload) => {
    const list = [
      ...state.list,
      ...payload.list.map(p => ({ ...p, image: p.cover }))
    ]
    state.list = list
    state.total = payload.total
  },
  [SAVE_PARAMS]: (state, payload = {}) => {
    state.page = payload.page || 1
    state.selectedFeatures = payload.selectedFeatures || []
  },
  [SAVE_CATEGORY]: (state, payload = '') => {
    state.category = payload
  },
  changeStatus(state, { type, bool }) {
    state[type] = bool
  }
}
const actions = {
  async regetProducts({ state, commit }, params = {}) {
    if (!state.loading) {
      const { category, selectedFeatures } = state
      const exactCategory = params.category
      commit('changeStatus', { type: 'loading', bool: true })

      const res = await Vue.iBox.http('getProducts', {
        category: exactCategory || category,
        features: selectedFeatures
      })()
      commit('changeStatus', { type: 'got', bool: true })

      commit(SAVE_CATEGORY, exactCategory || category)
      commit(SAVE_PARAMS, {
        category: exactCategory || category,
        selectedFeatures,
        page: 1
      })
      commit(SAVE_LIST, res)
      commit('changeStatus', { type: 'loading', bool: false })
    }
  },
  async regetProductAfterCategoryChanged({ state, commit }, params = {}) {
    if (!state.loading) {
      commit('changeStatus', { type: 'loading', bool: true })
      const res = await Vue.iBox.http('getProducts', {
        category: params.category
      })()
      commit('changeStatus', { type: 'got', bool: true })

      commit(SAVE_PARAMS, { category: params.category, page: 1 })
      commit(SAVE_LIST, res)
      commit('changeStatus', { type: 'loading', bool: false })
    }
  },
  async appendProducts({ state, commit }) {
    const { category, page, selectedFeatures, appending } = state
    if (!appending) {
      commit('changeStatus', { type: 'appending', bool: true })
      const res = await Vue.iBox.http('getProducts', {
        category,
        page: page + 1,
        features: selectedFeatures
      })()
      commit(SAVE_PARAMS, { category, selectedFeatures, page: page + 1 })
      commit(APPEND_LIST, res)
      commit('changeStatus', { type: 'appending', bool: true })
    }
  },
  async searchProducts({ state, commit }, payload) {
    const res = await Vue.iBox.http('searchProducts', {
      name: payload.name,
      category: payload.category
    })()
    commit(SAVE_LIST, res)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
