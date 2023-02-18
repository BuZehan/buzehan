import { createStore } from 'vuex'
import createPersistedstate from 'vuex-persistedstate'
import chatInfo from './modules/chatInfo'
export default createStore({
  modules: {
    chatInfo
  },
  plugins: [
    createPersistedstate({
      key: 'chatList', //本地存储的名字
      paths: ['chatInfo'] //需要本地存储的模块
    })
  ]
})
