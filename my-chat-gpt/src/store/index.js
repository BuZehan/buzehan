import { createStore } from 'vuex'
import createPersistedstate from 'vuex-persistedstate'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  plugins: [
    createPersistedstate({
      key: 'net-ease-cloud-music', //本地存储的名字
      paths: ['ChatInfo'] //需要本地存储的模块
    })
  ]
  }
})
