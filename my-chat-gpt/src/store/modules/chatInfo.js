let avatar = require('@/assets/image/avatar.jpg')
export default {
    namespaced:true,
    state:() => {
        return {
          chatInfo:[
            {
              from: 'bot',
              face: 'https://i.postimg.cc/jdS60KQW/openai.png',
              text: `嗨~，很高兴认识你~`,
              showType: 1
            },
            {
              from: 'bot',
              face:
                avatar,
              url: '',
              text: '想画什么,详细描述给我',
              showType: 0
            }
          ]
        }
    },
    getters:{
      chatListInfo(state) {
        return state.chatInfo
      }
    },
    mutations:{
      InsertChatInfo(state,value) {
        state.chatInfo = value
      }
    },
    actions:{
      InsertChatInfo(ctx,value) {
        ctx.commit('InsertChatInfo',value)
      }
    }
}