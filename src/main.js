import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VueAxios from 'vue-axios';
import axios from 'axios';
import './plugins/ant-design-vue.js';
import store from './store'

Vue.use(VueAxios, axios);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
