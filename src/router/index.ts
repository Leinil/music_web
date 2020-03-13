import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import sideContent from '../views/showSideContent.vue';
import InitContent from "@/views/InitContentPage.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component:InitContent,
  },
  {
    path: '/side/:type',
    component:sideContent
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
