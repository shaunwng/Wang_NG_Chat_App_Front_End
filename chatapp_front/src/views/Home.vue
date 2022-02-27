<template>
  <!-- <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App. The Vue CLI is pretty awesome."/>
  </div> -->
  <section id="welcome-wrapper">
    <h1 class="hidden">Sign In</h1>
    <h2>Welcome to the Chat App</h2>

     <input type="text" name="username" v-model="username" placeholder="Your Name">

    <div class="controls">
      <button
        :class="{ 'disabled' : canJoin }"
        :disabled="canJoin"
        @click="goToChat"
      >Join Chat!</button>

     <button @click="goToChat">Join Anonymously</button>
    </div>
  </section>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'LoginPage',

  data() {
    return {
      loggedIn: false,
      username: ''
    }
  },

  computed: {
    canJoin: function() {
      return (this.username.trim() === "")
    }
  },
  methods: {
    goToChat(){
      this.$router.push({name:"Chat", params: { ChatUserName: this.username || "Anonymous"}});
    }
  }
};
</script>

<style lang="scss">
  @import "@/assets/sass/_home.scss";
  @import "@/assets/sass/_reset.scss";
  @import "@/assets/sass/_chat.scss";
</style>
