<template>
  <div class="container">
    <h2 class="header">
      ChatGpt
    </h2>
    <div ref="listWrapper" class="chat-list-wrapper">
      <div class="chat-item" v-for="(chat, index) in chatList" :key="index">

        <!-- 判断消息是从自己发出 -->
        <template v-if="chat.from === 'self'">
          <!--自己的消息 showType === 1 对话模式 -->
          <p class="oneself" v-if="chat.showType === 1 && this.chatModel === 1">
            <span>{{ chat.text }}</span>
            <a href="javascript:;">
              <img :src="chat.face" alt="">
            </a>
          </p>
          <!--自己的消息 showType === 0 作图模式  -->
          <p class="oneself" v-if="chat.showType === 0 && this.chatModel === 0">
            <span>{{ chat.text }}123</span>
            <a href="javascript:;">
              <img :src="chat.face" alt="">
            </a>
          </p>
        </template>

        <!-- 判断消息是AI发出 -->
        <template v-else>
          <!--AI的消息 showType === 1 对话模式 -->
          <p class="AI" v-if="chatModel === 1 && chat.showType === 1">
            <a href="javascript:;">
              <img src="https://i.postimg.cc/jdS60KQW/openai.png" alt="">
            </a>
            <span>{{ chat.text }}</span>
          </p>
          <!--AI的消息 showType === 0 作图模式 -->
          <p class="AI" v-if="chatModel === 0 && chat.showType === 0">
            <a v-if="chat.url || chat.text" href="javascript:;">
              <img src="https://i.postimg.cc/jdS60KQW/openai.png" alt="">
            </a>
            <span v-if="chat.url">
              <span v-for="item, i in chat.url" :key="i" href="">
                <img @click="showImgFn(item.url)" :src="item.url" alt="" />
              </span>
            </span>
            <span v-if="chat.text">{{ chat.text }}</span>
          </p>
        </template>

      </div>
    </div>
    <div class="chat-wrapper">
      <input class="chatInput" type="text" v-model="prompt">
      <button :disabled="this.isAble" ref="sendBtn" @click="submitForm">{{ currentTime }}</button>
      <button ref="changeModle" @click="changeModel">{{ chatModel === 1 ? "作图" : "对话" }}</button>
    </div>
    <div @click="close" :class="[isLoading ? 'loading' : 'close']" ref="loading"><span>努力响应中... 请稍后</span></div>
    <div :class="[isStart ? 'isStart' : 'close']">
      <div id="threeWrapper" ref="listWrapper">
        <h1 ref="loadCur"></h1>
      </div>
      <input v-model="api_key" type="password" placeholder="请输入API keys" />

      <button @click="ok">确&nbsp;&nbsp;认</button>
      <p>
        temperature&nbsp;
        <input class="range" type="range" ref="range" name="" id="" @change="changeRange" v-model="temperature" min="0"
          max="1" step="0.1" />
        <span>{{ temperature }}</span>
      </p>
      <i>temperature：要使用的采样策略。 接近 1 的值会给模型带来更多风险/创造力，而接近 0 的值会生成明确定义的答案。</i>
    </div>

    <!--展示图片 -->
    <div @click="closeShowImgFn" :class="{ showImgUrl }">
      <img @click="closeShowImgFn" :src="showImgUrl" alt="">
    </div>
  </div>
</template>

<script>
import auto from '@/utils/auto'
import axios from 'axios'
var avatar = require('@/assets/image/avatar.jpg')
import ThreeModle from '@/utils/main'
window.__Loading = {
  loading: 0
}

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      showImgUrl: '',
      chatModel: 1,
      isStart: false,
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
      urlData: '',
      chatList: [
        {
          from: 'bot',
          face: 'https://i.postimg.cc/jdS60KQW/openai.png',
          text: `嗨 靓仔，很高兴认识你！`,
          showType: 1
        },
        {
          from: 'bot',
          face:
            avatar,
          url: '',
          text: '想画什么,详细描述给我',
          showType: 0
        },
        {
          from: 'self',
          face:
            avatar,
          text: '嗨，很高兴认识你',
          showType: 1
        }
      ],
      temperature: 0,
      baseUrl: 'https://api.openai.com/v1/completions'
    };
  },
  mounted() {
    let obj = window.__Loading
    auto.Observe(obj)
    let Loading = {
      loadNum: 0,
      lastLoading: 0
    }
    this.isStart = true
    ThreeModle(this.$refs.listWrapper, Loading)
    console.log('object :', this.$refs.listWrapper)
  },
  methods: {
    showImgFn(url) {
      this.showImgUrl = url
    },
    closeShowImgFn() {
      this.showImgUrl = ''
    },
    changeModel() {
      this.chatModel = this.chatModel === 1 ? 0 : 1
      this.baseUrl = this.chatModel === 1 ? 'https://api.openai.com/v1/completions' : 'https://api.openai.com/v1/images/generations'
      console.log(this.chatModel)
    },
    submitForm() {

      let data = null;
      //函数防抖
      if (this.chatModel === 1) {
        data = {
          prompt: this.prompt,
          model: this.model,
          max_tokens: this.max_tokens,
        }
      } else {
        //作图模式
        data = {
          prompt: this.prompt,
          n: 1,
          size: "1024x1024"
        }
      }

      if (!this.isAble) {
        this.isLoading = true
      }
      this.chatList.push({
        from: 'self',
        face:
          avatar,
        text: this.prompt,
        showType: this.chatModel
      });
      axios.post(this.baseUrl, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ` + this.api_key,
        }
      })
        .then(response => {
          this.isLoading = false
          if (this.chatModel === 1) {//对话模式
            this.response = response.data.choices[0].text;
            this.chatList.push({
              from: 'bot',
              face:
                'https://i.postimg.cc/jdS60KQW/openai.png',
              text: this.response,
              showType: 1
            });
          } else if (this.chatModel === 0) {//作图模式
            this.response = response.data
            this.chatList.push({
              from: 'bot',
              face:
                'https://i.postimg.cc/jdS60KQW/openai.png',
              url: this.response.data,
              showType: 0
            });
          }
        })
        .catch(error => {
          this.isLoading = true
          this.$refs.loading.children[0].innerText = error
          console.log('error :', error)
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
    },
    ok() {

      this.isStart = false
    }
  },
  destroyed() {
    window.__Loading = null;
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
.showImgUrl {
  position: absolute;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background-color: #0000008a;
  display: flex;
  justify-content: center;
  top: 0;
  align-items: center;

  img {
    width: 100vw;
    height: auto;
  }
}

.loading,
.isStart,
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
  align-items: center;
  transition: all .2s linear;
  background-color: #00000044;

  p {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;

    span {
      width: 20px;
    }

    input {
      width: 150px;
      padding: 0;
      transform: none;
    }
  }

  i {
    font-size: 14px;
    margin-top: 20px;
    transform: scale(0.8);
  }

  span {
    display: block;
    width: 80%;
    text-align: center;
  }
}

.isStart {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #ffffff;
  color: #333;

  input {
    border: none;
    padding: 2px 5px;
    display: block;
    height: 40px;
    padding-left: 15px;
    transition: all 0s;
    width: 280px;
    box-shadow: 0 0 15px #00000010;
    border-radius: 25px;
    transform: scale(0.9);
  }

  .range {
    height: 10px;
  }

  button {
    border: none;
    width: 200px;
    height: 30px;
    color: #3f3f3f;
    font-weight: 900;
    font-size: 18px;
    border-radius: 50px;
    margin: 30px 0;
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
    justify-content: space-around;
    background-color: #0093E9;
    background-image: -webkit-linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);
    background-image: -moz-linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);
    background-image: -o-linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);
    background-image: linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);
    color: #fff;
  }

  .chat-list-wrapper {
    height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: auto;
    padding-top: 20px;
    padding-bottom: 15px;

    .chat-item {
      padding: 0 8px;

      p {
        margin: 8px 0;
      }
    }

    .oneself {
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      flex-shrink: 1;

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
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
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

  /*底部*/
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
      width: 58px;
      transform: scale(0.9);
      border-radius: 8px;
      border: none;
      font-weight: 900;
      height: 30px;
      color: #222222;
      font-size: 14px;
    }
  }

  #threeWrapper {
    margin: 0 auto;
    margin-bottom: 8px;
    width: 100%;
    position: relative;
    z-index: 9999;
    height: 300px;

    canvas {
      border-radius: 8px;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
