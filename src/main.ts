import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import service from '@/utiles/axios';
import './plugins/element.js'

Vue.config.productionTip = false
Vue.prototype.$axios = service;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
