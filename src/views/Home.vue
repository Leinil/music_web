<template>
  <div id="homeContainer">
    <div id="top">
      <HomePageTopbar />
    </div>
    <div id="side">
      <HomaPageSidebar />
    </div>
    <div id="content">
      <HomePageContent />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HomaPageSidebar from "@/views/HomePageSidebar.vue";
import HomePageTopbar from "@/views/HomePageTopbar.vue";
import HomePageContent from "@/views/HomePageContent.vue";

export default {
  name: "home",
  components: {
    HomaPageSidebar,
    HomePageTopbar,
    HomePageContent
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
  border-bottom: 2px solid rgb(151, 24, 24);
}
#side {
  position: absolute;
  top: 50px;
  left: 0px;
  width: 200px;
  height: calc(100% - 50px);
  border-right: 1px solid rgb(59, 60, 64);
  background: rgb(38, 40, 44);
}
#content {
  padding-top: 50px;
  padding-left: 15%;
  width: 100%;
  height: 100%;
}
</style>