<template>
  <main v-show="user">
    <h1 class="welcome-message">Welcome to The Chat Room {{ this.user.username }} !</h1>

    <section id="chat">
      <!-- this left-hand side of our UI where we see current users -->
      <section id="chat-users-ui">
        <h2>Current Users:</h2>
        <!-- list of users-->
        <ul id="current-users">
          <!-- this will take a sub-component that will render-->
          <li
            class="current-users-item"
            v-for="member in members"
            :key="member.username"
          >
            <img
              :src="require('../assets/avatar/' + member.avatar)"
              alt
            />
            <div class="text">
              <div>{{member.username || 'Anonymous'}}</div>
              <div
                class="typing"
                v-if="typinglist.includes(member.id)"
              >Typing...</div>
            </div>
          </li>
        </ul>
      </section>

      <!-- end left hand-->

      <!-- main chat UI-->

      <section id="chat-messages-ui">
        <!-- custom chat message component here -->
        <div class="chat-messages-list" v-chat-scroll>
          <ChatMessage
            v-for="msg in messages"
            :user="user"
            :key="msg.id"
            :msg="msg"
          />
        </div>
        <section id="text-wrapper">
          <textarea
            @keyup="trySendMessage"
            id="message"
            v-model="message"
            placeholder="What's on your mind?"
          ></textarea>

          <button
            id="sendMessage"
            @click="sendMessage"
            :class="{ 'disabled' : canSend }"
            :disabled="canSend"
          >
            <i
              class="fa fa-paper-plane"
              aria-hidden="true"
            ></i>
          </button>

          <!-- insert emoji picker function by vue-emoji-picker package -->
          <emoji-picker @emoji="insert">
            <div
              class="emoji-invoker"
              slot="emoji-invoker"
              slot-scope="{ events: { click: clickEvent } }"
              @click.stop="clickEvent"
            >
              <svg
                height="24"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 0h24v24H0z"
                  fill="none"
                />
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
            </div>
            <div
              slot="emoji-picker"
              slot-scope="{ emojis, insert, display }"
            >
              <div
                class="emoji-picker"
                :style="{ top: display.y + 'px', left: display.x + 'px' }"
              >
                <div>
                  <div
                    v-for="(emojiGroup, category) in emojis"
                    :key="category"
                  >
                    <h5>{{ category }}</h5>
                    <div class="emojis">
                      <span
                        v-for="(emoji, emojiName) in emojiGroup"
                        :key="emojiName"
                        @click="insert(emoji)"
                        :title="emojiName"
                      >{{ emoji }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </emoji-picker>
        </section>
      </section>
    </section>
  </main>
</template>

<script>
// import io from "socket.io-client";
// import vars from "@/env.js";
import ChatMessage from '@/components/ChatMessage.vue';
import EmojiPicker from 'vue-emoji-picker'
export default {
  name: "TheChatComponent",
  components: { EmojiPicker, ChatMessage },
  props: {
    username: String,
    user: Object,
    socket: Object,
    members: Array,
    typinglist: Array,
  },

  mounted() {
    let vm = this;

    this.socket.on('messages', (message) => {
      // [...] is a the spread operator
      // short hand way to add something to an array, or put
      // 2 arrays together,etc
      vm.messages = [...vm.messages, message];
    })

    this.socket.on('SOMEONE_TYPING', (data) => console.log('someone is typing', data));
  },

  computed: {
    canSend: function() {
      return (this.message.trim() === "")//evaluated to true or false
    }
  },

  data() {
    return {
      socketID: '',
      message: '',
      messages: [],
    }
  },
  watch: {
    message: function(val) {
      if (val !== '') {
        this.typing();
      } else {
        this.endTyping();
      }
    }
  },
  methods: {
    insert(emoji) {
      this.message += emoji
    },
    sendMessage() {
      this.socket.emit('messages', { user: this.user.username || "Anonymous", avatar: this.user.avatar || 'one.png', message: this.message })

      // empty out the text area and get ready to input a new message
      this.message = '';
    },

    trySendMessage(event) {
      // console.log('typing a message');


      //if the enter is pushed and canSend has a value, then call the sendMessage method
      if (event.keyCode === 13 && this.canSend === false) {
        this.sendMessage();
      } else {
        // else fire off the USER_TYPING event to the Chat Serve.
        this.socket.emit('USER_TYPING', { user: this.username || "Anonymous" });
      }
    },
    typing() {
      this.socket.emit('typing', null);
    },
    endTyping() {
      this.socket.emit('endtyping', null);
    }
  },

}
</script>

<style lang="scss">
@import "@/assets/sass/_chat.scss";
</style>
