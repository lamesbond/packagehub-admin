import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

import user from './modules/user'
import doc from './modules/doc'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    doc
  },
  getters
})

export default store
