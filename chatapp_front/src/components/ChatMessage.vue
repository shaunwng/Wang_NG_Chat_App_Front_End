<template>
  <div class="message-panel"  :class="msg.user === user.username? 'justify-end':''">
    <img
      :src="require('../assets/avatar/' + msg.avatar)"
      alt
      v-if="msg.user !== user.username"
    />

    <div class="message-wrapper" >
      <h1 :class="msg.user === user.username? 'text-end':'text-start'">{{ msg.user }} says:</h1>
      <p class="msg-text" :class="msg.user === user.username? 'bg-white':''">
        {{ msg.message }}
      </p>
    </div>
    <img
      :src="require('../assets/avatar/' + msg.avatar)"
      alt
      v-if="msg.user === user.username"
    />
  </div>
</template>

<script>
export default {
  name: "ChatMessageComponent",

  props: {
    msg: Object,
    user: Object
  }
}
</script>

<style lang="scss">
@import "@/assets/sass/_messages.scss";
</style>
