import Vue from 'vue'
import Vuex from 'vuex'
import router, { resetRouter } from '@/router'
import userApi from '@/api/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : {},
    token: localStorage.getItem('token') || '',
    lang: localStorage.getItem('lang') || 'zhCN',
    userPermission: null,
    userRouter: null,
    leftMenu: [],
    leftCollapse: localStorage.getItem('leftCollapse') === 'true'
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_USER: (state, user) => {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    SET_LANG: (state, lang) => {
      state.lang = lang
      localStorage.setItem('lang', lang)
    },
    SET_USER_PERMISSION (state, permission) {
      state.userPermission = permission
    },
    SET_USER_RESOURCE (state, resource) {
      state.userRouter = resource
    },
    SET_LEFT_MENU (state, menu) {
      state.leftMenu = menu
    },
    SET_LEFT_COLLAPSE (state, collapse) {
      state.leftCollapse = collapse
      localStorage.setItem('leftCollapse', collapse)
    }
  },
  actions: {
    login ({ commit, state }, userInfo) {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        const serveLang = {
          zhCN: 'zh_CN',
          en: 'en_US'
        }
        userApi.login({ userName: username, password: password, lang: serveLang[state.lang] })
          .then((response) => {
            const user = {
              userId: response.data.user.userId,
              userName: response.data.user.userName
            }
            commit('SET_USER', user)
            commit('SET_TOKEN', response.data.authorization)
            resolve()
          })
      })
    },
    logout ({ dispatch, commit }) {
      return new Promise((resolve) => {
        userApi.logout().then(() => {
          dispatch('clearUserInfo')
          resolve()
        })
      })
    },
    getUserPermission ({ dispatch, commit }) {
      userApi.getPermission().then((res) => {
        commit('SET_USER_PERMISSION', res.data.rows)
      }).catch(() => {
        dispatch('clearUserInfo')
        router.push('/login')
      })
    },
    async getUserResource ({ commit }, userId) {
      const res = await userApi.getUserResource({ userId: userId })
      if (res && res.code === 200) {
        commit('SET_USER_RESOURCE', res.data.rows.text)
      }
    },
    clearUserInfo ({ commit }) {
      commit('SET_TOKEN', '')
      commit('SET_USER', {})
      commit('SET_USER_PERMISSION', null)
      // 重设路由
      resetRouter()
    }
  }
})
