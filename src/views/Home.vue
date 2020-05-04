<template>
  <div id="homeContainer">
    <div>
      <div id="top">
        <HomePageTopbar />
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HomePageTopbar from "@/views/HomePageTopbar.vue";
export default {
  name: "home",
  components: {
    HomePageTopbar,
  },
  data() {
    return {};
  },
  mounted() {},
  watch: {}
};
</script>
<style scoped>
#homeContainer {
  width: 100%;
  height: 100%;
}
#top {
  width: 100%;
  height: 48px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
  border-bottom: 2px solid rgb(151, 24, 24);
}
</style>