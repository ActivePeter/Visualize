import Vue from 'vue'
import VueRouter from 'vue-router'
import context from "../main"

Vue.use(VueRouter);


const routes = [

];

const router = new VueRouter({
  linkActiveClass: 'is-active',
  base: process.env.BASE_URL,
  routes
});

export default router
