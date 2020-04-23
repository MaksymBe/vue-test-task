import Vue from 'vue';
import VueRouter from 'vue-router';
import Search from '../views/Search.vue';
import User from '../views/User.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Search,
  },
  {
    path: '/user/:login',
    name: 'user',
    component: User,
    props: true,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
