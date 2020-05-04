<template>
  <div>
    <div id="side">
      <HomaPageSidebar />
    </div>
    <div id="content">
      <router-view></router-view>
    </div>
    <music-player></music-player>
  </div>
</template>

<script>
// @ is an alias to /src
import HomaPageSidebar from "@/views/HomePageSidebar.vue";
import MusicPlayer from "@/views/publicPages/musicPlayer.vue";
export default {
  name: "home",
  components: {
    HomaPageSidebar,
    "music-player": MusicPlayer
  },
  data() {
    return {};
  },
  mounted() {},
  watch: {}
};
</script>
<style scoped>
@media screen and (max-width: 1280px) {
  #side {
    display: none;
  }
  #content {
    padding-top: 50px;
    overflow: auto;
    height: calc(100vh - 100px);
  }
}
@media screen and (min-width: 1280px) {
  #side {
    display: block;
    position: absolute;
    top: 50px;
    left: 0px;
    width: 200px;
    height: calc(100% - 50px);
    border-right: 1px solid rgb(59, 60, 64);
    background: rgb(25, 27, 31);
  }
  #content {
    padding-top: 50px;
    overflow: auto;
    padding-left: 200px;
    width: calc(100vw - 200px);
    height: calc(100vh - 100px);
  }
}
</style>