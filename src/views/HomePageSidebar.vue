<template>
  <div id="sidebar">
    这里是侧边栏
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class HomePageSidebar extends Vue {
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
#sidebar{
    height: 100%;
    width:100%;
    color: chocolate;
}
</style>
