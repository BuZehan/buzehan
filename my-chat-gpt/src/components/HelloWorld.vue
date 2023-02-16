<template>
  <div class="container">
    <h2 class="header">
      ChatGpt
      <input  v-model="api_key" type="password" placeholder="请输入API keys" />
    </h2>
    <div ref="listWrapper" class="chat-list-wrapper">
      <div class="chat-item" v-for="(chat, index) in chatList" :key="index">

        <!-- 判断消息是从自己发出还是接收 -->
        <template v-if="chat.from === 'self'">
          <p class="oneself">
            <span>{{ chat.text }}</span>
            <a href="javascript:;">
              <img :src="chat.face" alt="">
            </a>
          </p>
        </template>
        <template v-else>
          <p class="AI">
            <a href="javascript:;">
              <img src="https://i.postimg.cc/jdS60KQW/openai.png" alt="">
            </a>
            <span>{{ chat.text }}</span>
          </p>
        </template>

      </div>
    </div>
    <div class="chat-wrapper">
      <input class="chatInput" type="text" v-model="prompt">
      <button :disabled="this.isAble" ref="sendBtn" @click="submitForm">{{ currentTime }}</button>
    </div>
    <div @click="close" :class="[isLoading ? 'loading' : 'close']" ref="loading"><span>努力响应中... 请稍后</span></div>
    <div @click="ok" :class="{"isStart":isStart}" ref="loading"><span>努力响应中... 请稍后</span></div>
  </div>
</template>

<script>
import axios from 'axios'
var avatar = require('@/assets/image/avatar.jpg')
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      currentTime: '发送',
      isAble: false,
      isLoading: false,
      api_key: "",
      prompt: '',
      chatMsg: '',
      prompt: '',
      max_tokens: 1000,
      model: 'text-davinci-003',
      mobile: true,
      response: '',
      chatList: [
        {
          from: 'bot',
          face: 'https://i.postimg.cc/jdS60KQW/openai.png',
          text: `嗨，很高兴认识你！一般来说，每分钟提问你不能超过两次。尽管可能有某些情况在短时间内可以接受多次提问，但一般情况下，推荐的最大问答频率是一分钟不超过两次。`
        },
        {
          from: 'self',
          face:
            avatar,
          text: '嗨，很高兴认识你'
        }
      ]
    };
  },

  methods: {
    submitForm() {
      //函数防抖
      let data = {
        prompt: this.prompt,
        model: this.model,
        max_tokens: this.max_tokens,
      }
      if (!this.isAble) {
        this.isLoading = true
      }
      this.chatList.push({
        from: 'self',
        face:
        avatar,
        text: this.prompt
      });
      axios.post('https://api.openai.com/v1/completions', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ` + this.api_key,
        }
      })
        .then(response => {
          this.isLoading = false
          this.response = response.data.choices[0].text;
          this.chatList.push({
            from: 'bot',
            face:
              'https://i.postimg.cc/jdS60KQW/openai.png',
            text: this.response
          });
          console.log(this.response)

        })
        .catch(error => {
          this.isLoading = true
          this.$refs.loading.children[0].innerText = error
          setTimeout(() => {
            this.isLoading = false
          }, 1000);
        });
        this.prompt = ''

      this.isAble = true
      if (this.isAble === true) {
        let i = 5;
        let interTime = setInterval(() => {
          this.currentTime = i == 0 ? '发送' : i
          if (i === 0) {
            clearInterval(interTime)
          }
          i--
        }, 1000);
        console.log('禁用按钮')
        setTimeout(() => {
          this.isAble = false
          console.log('解除禁用')
        }, 5000);
        return
      }
    },
    close() {
      this.isLoading = false
    }
  },
  watch: {
    'chatList': {
      handler(v) {
        this.$nextTick(() => {
          let wrapper = this.$refs.listWrapper
          wrapper.scrollTop = wrapper.scrollHeight
        })
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.loading,
.close {
  position: absolute;
  width: 100vw;
  top: 0;
  height: 100vh;
  overflow: hidden;
  z-index: 8888;
  color: #fff;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding: 15px;
  align-items: center;
  transition: all .5s linear;
  background-color: #00000044;

  span {
    display: block;
    width: 80%;
    text-align: center;
  }
}

.close {
  opacity: 0;
  z-index: -15;
}

.container {
  width: 100vw;
  height: 100vh;
  position: relative;

  .header {
    height: 5vh;
    display: flex;
    align-items: center;
    padding-left: 10px;
    justify-content:space-around;
    background-color: #0093E9;
    background-image: -webkit-linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);
    background-image: -moz-linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);
    background-image: -o-linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);
    background-image: linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);
    color: #fff;
    input{
      border: none;
      padding: 2px 5px;
      display: inline-block;
      margin-left: 5px;
      border-radius: 4px;
      width: 150px;
    }
  }

  .chat-list-wrapper {
    height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: auto;
    padding-top: 20px;
    padding-bottom: 15px;

    .chat-item {
      padding: 10px 5px;
    }

    .oneself {
      display: flex;
      padding: 5px;
      justify-content: flex-end;
      align-items: flex-start;
      flex-shrink: 1;
      margin-top: 15px;
      span {
        max-width: 68vw;
        min-width: 30px;
        min-height: 40px;
        border-radius: 7px;
        display: flex;
        align-items: center;
        box-shadow: 0 0 18px #6c6c6c42;
        padding: 5px;
        text-align: justify;
      }

      a {
        margin-top: 1px;
        width: 40px;
        height: 40px;
        margin-left: 15px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .AI {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;

      span {
        min-width: 30px;
        max-width: 68vw;
        background-color: #20b7ff;
        background-image: -webkit-linear-gradient(43deg, #20b7ff 0%, #9aff8b 74%, #5aff6b 99%);
        background-image: -moz-linear-gradient(43deg, #20b7ff 0%, #9aff8b 74%, #5aff6b 99%);
        background-image: -o-linear-gradient(43deg, #20b7ff 0%, #9aff8b 74%, #5aff6b 99%);
        background-image: linear-gradient(43deg, #20b7ff 0%, #9aff8b 74%, #5aff6b 99%);
        min-height: 40px;
        display: inline-block;
        border-radius: 7px;
        display: flex;
        align-items: center;
        padding: 5px;
        text-align: justify;
        box-shadow: 0 0 18px #45454542;
      }

      a {
        width: 40px;
        height: 40px;
        margin-right: 15px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .chat-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    width: 100vw;
    padding: 8px 12px;
    background-color: #000000;

    .chatInput {
      height: 30px;
      width: 270px;
      border: none;
      background-color: #fff;
      border-radius: 8px;
      padding: 1px 5px;
    }

    button {
      width: 70px;
      border-radius: 8px;
      border: none;
      height: 30px;
      color: #fff;
      background-color: #00DBDE;
      background-image: linear-gradient(90deg, #00DBDE 0%, #FC00FF 100%);

    }
  }
}
</style>
