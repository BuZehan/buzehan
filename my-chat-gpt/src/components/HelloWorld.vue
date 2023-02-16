<template>
  <div class="container">
    <h2 class="header">
      ChatGpt
    </h2>
    <div class="chat-list-wrapper">
      <div class="chat-item" v-for="(chat, index) in chatList" :key="index">

        <!-- 判断消息是从自己发出还是接收 -->
        <template v-if="chat.from === 'self'">
          <p class="oneself">
            <span>{{ chat.text }}</span>
            <a href="javascript:;">
              <img src="https://i.postimg.cc/jdS60KQW/openai.png" alt="">
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
      <button @click="submitForm">发送</button>
    </div>
  <div @click="close" :class="{'loading':isLoading}" ref="loading"><span>响应中... 请稍后</span></div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      isLoading:false,
      api_key: "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",
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
          face:'https://i.postimg.cc/jdS60KQW/openai.png',
          text: `嗨，很高兴认识你！一般来说，每分钟提问你不能超过两次。尽管可能有某些情况在短时间内可以接受多次提问，但一般情况下，推荐的最大问答频率是一分钟不超过两次。`
        },
        {
          from: 'self',
          face:
            'https://i.postimg.cc/jdS60KQW/openai.png',
          text: '嗨，很高兴认识你'
        }
      ]
    };
  },
  methods: {
    submitForm() {
      let data = {
        prompt: this.prompt,
        model: this.model,
        max_tokens: this.max_tokens,
      }
      this.isLoading = true
      this.chatList.push({
        from: 'self',
        face:
          'https://i.postimg.cc/jdS60KQW/openai.png',
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

          this.prompt = "";
        })
        .catch(error => {
          this.isLoading = true
          this.$refs.loading.children[0].innerText = error
          setTimeout(() => {
            this.isLoading = false
          }, 4000);
        });
    },
    close() {
      this.isLoading = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.loading{
  position: absolute;
  transition:all 0.5s ease-in;
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
  background-color: #00000083;
  span{
    display: block;
    width: 80%;
    text-align: center;
  }
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
    .chat-item {
      padding: 10px 5px;
    }

    .oneself {
      display: flex;
      padding: 5px;
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
        box-shadow: 0 0 15px #0000002d;
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
        border-radius: 7px;
        display: flex;
        align-items: center;
        padding: 5px;
        text-align: justify;

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
