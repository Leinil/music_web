<template>
  <div class="hello">
    <div class="developIng">
      <h2>功能开发中..</h2>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.hello{
  position: relative;
  height: 100vh;
}
.developIng {
  color: white;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 400px;
  height: 300px;
  margin: auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-image: url(../../src/assets/developing.gif);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  h2{
    position: absolute;
    top: 80px;
  }
}
</style>
