import Vue from 'vue'
import VueRouter from 'vue-router'
import MusicPage from '@/views/MusicPage.vue'
import SideContent from '@/views/MusicPageSidebarContent.vue';
import FindMusicIndex from "@/views/musicContentPages/finMusic/index.vue";
import VideoContent from '@/views/showVideoContent.vue';
import SongSheet from '@/views/publicPages/songSheet.vue';

//总体路由设计： 除了最上层的导航栏固定外 根据页面布局分为两类 
//1.歌曲类 ：歌曲类的内容左侧为功能导航栏 根据初始界面和功能切换暂时 右侧内容
//2.视频类 ：视频类的内容没有左右侧划分

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: "/index",
    component: MusicPage,
    children: [
      {
        path: 'index',
        name:'findMusicPage',
        component: FindMusicIndex
      },
      {
        path: '/side/:type',
        component: SideContent
      },
      {
        path:'/side/songSheet/:id',
        component:SongSheet,
      }
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
