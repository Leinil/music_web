import Vue from 'vue'
import VueRouter from 'vue-router'
import initHome from '../views/InitHome.vue'
import sideContent from '../views/showSideContent.vue';
import InitContent from "@/views/InitContentPage.vue";
import VideoContent from '@/views/VideoContent.vue';

//总体路由设计： 除了最上层的导航栏固定外 根据页面布局分为两类 
//1.歌曲类 ：歌曲类的内容左侧为功能导航栏 根据初始界面和功能切换暂时 右侧内容
//2.视频类 ：视频类的内容没有左右侧划分

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: "/index",
    component: initHome,
    children: [
      {
        path: 'index',
        component: InitContent
      },
      {
        path: '/side/:type',
        component: sideContent
      },
    ]
  },
  {
    path: '/video',
    component: VideoContent,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
