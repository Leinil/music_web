<template>
  <div>
    <div id="side">
      <HomaPageSidebar />
    </div>
    <div id="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HomaPageSidebar from "@/views/HomePageSidebar.vue";

export default {
  name: "home",
  components: {
    HomaPageSidebar
  },
  data() {
    return {};
  },
  mounted() {},
  watch: {}
};
</script>
<style scoped>
#side {
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
  padding-left: 200px;
  width: calc(100vw - 200px);
  height: calc(100vh - 50px);
  overflow: auto;
}
</style>