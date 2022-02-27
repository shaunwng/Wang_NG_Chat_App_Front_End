import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Notifications from 'vue-notification'
import VueChatScroll from 'vue-chat-scroll'

Vue.config.productionTip = false;
Vue.use(Notifications)
Vue.use(VueChatScroll)
new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');