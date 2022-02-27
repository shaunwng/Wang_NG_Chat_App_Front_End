<template>

  <section
    v-if="isShow"
    id="welcome-wrapper"
  >
    <h1 class="hidden">Sign In</h1>
    <!-- <h2>Welcome to the Chat App</h2> -->
    <div v-if="isShow">
      <div class="login_left">
        <div class="left_container">
          <h2>Welcome to the Fanshawe Chatroom</h2>
        </div>
      </div>

      <div class="login_right">
        <div class="right_container">
          <input
            type="text"
            name="username"
            v-model="username"
            ref="inputUsername"
            placeholder="Your Name"
          >

          <div class="chooseAvatar">
            <label for="avatar">Choose your avatar</label>

            <ul class="avatarWrap">
              <li
                v-for="(item,index) in imgUrl"
                :key="item"
              >
                <img
                  :src="require('../assets/avatar/' + item)"
                  alt
                  @click="clickAvatar(index,item)"
                  :class="{active:currentIndex===index?true:false}"
                  :disabled="canJoin"
                />
              </li>
            </ul>
          </div>

          <div class="controls">
            <button
              :class="{ 'disabled' : canJoin }"
              :disabled="canJoin"
              @click="goToChat"
            >Join Chat!</button>

            <button @click="goToChat">Join Anonymously</button>
          </div>
        </div>
      </div>
    </div>
  </section>
  <chatRoom
    v-else
    :user="user"
    :members="members"
    ref="chatroom"
    :socket="socket"
    :typinglist="typinglist"
    @sendServer="sendServer"
  />
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';
import vars from "@/env.js";
import io from 'socket.io-client';
import ChatRoom from './Chat.vue'
export default {
  name: 'LoginPage',
  components: { ChatRoom },
  data() {
    return {
      imgUrl: [
        'one.png',
        'two.png',
        'four.png',
        'three.png',
        'eight.png',
        'seven.png',
        'six.png',
        'five.png',
        'nine.png',
        'ten.png',
        'eleven.png',
        'twelve.png',
        'thirteen.png',
        'fourteen.png',
        'fifteen.png',
      ],
      loggedIn: false,
      username: '',
      currentIndex: 0,
      currentAvatar: 'one.png',
      socket: null,
      isShow: true,
      user: {},
      members: [],
      typinglist: [],
    }
  },

  computed: {
    canJoin: function() {
      return (this.username.trim() === "")
    }
  },
  methods: {
    clickAvatar(index, item) {
      this.currentIndex = index
      this.currentAvatar = item
    },
    goToChat() {
      const username = this.$refs.inputUsername.value;

      this.socket.emit('login', {
        username,
        avatar: this.currentAvatar,
      })

    },
    sendServer(content) {
      const { username, avatar } = this.user
      this.socket.emit('sendMessage', { msg: content, username, avatar })
    }
  },
  mounted() {
    this.socket = io(vars.basePath)

    this.socket.on('loginsuccess', (data) => {
      alert('Log In successfully!')
      this.user = data
      this.isShow = false
    })

    this.socket.on('loginfailed', (data) => {
      this.$notify({
        group: 'msg',
        type: 'error',
        text: data.msg
      });
    })

    this.socket.on('members', (data) => {
      this.members = data
    })

    this.socket.on('typing', (data) => {
      if (!this.typinglist.includes(data.id)) {
        this.typinglist.push(data.id)
      }
    })

    this.socket.on('endtyping', (data) => {
      if (this.typinglist.includes(data.id)) {
        this.typinglist = this.typinglist.filter((id) => id !== data.id)
      }
    })

    this.socket.on('leave', (data) => {
      this.$notify({
        group: 'msg',
        type: 'info',
        text: data.msg
      });
    })

    this.socket.on('join', (data) => {
      this.$notify({
        group: 'msg',
        type: 'info',
        text: data.msg
      });
    })

  }
};



</script>

<style lang="scss">
@import "@/assets/sass/_home.scss";
@import "@/assets/sass/_reset.scss";
@import "@/assets/sass/_chat.scss";
</style>
