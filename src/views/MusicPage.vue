<template>
  <div>
    <div id="side">
      <MusicPageSidebar />
    </div>
    <div id="content">
      <router-view></router-view>
    </div>
    <music-player></music-player>
  </div>
</template>

<script>
// @ is an alias to /src
import MusicPageSidebar from "@/views/MusicPageSidebar.vue";
import MusicPlayer from "@/views/publicPages/musicPlayer.vue";
export default {
  name: "home",
  components: {
    MusicPageSidebar,
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
    padding-left: 201px;
    width: calc(100vw - 200px);
    height: calc(100vh - 100px);
  }
}
</style>