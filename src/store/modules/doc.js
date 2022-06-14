import docApi from '@/api/core/doc'

const state = {
  versionId: '',
  menuId: ''
}

const mutations = {
  SET_VERSIONID: (state, versionId) => {
    state.versionId = versionId
    localStorage.versionId = versionId
  },
  SET_MENUID: (state, menuId) => {
    state.menuId = menuId
  }
}

const actions = {
  // user login
  setversionid({ commit }, versionId) {
    commit('SET_VERSIONID', versionId)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

