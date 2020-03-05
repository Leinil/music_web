<template>
  <div id="topbar">
    <div class="wYIcon iconTitle" @click="goBackToHome()"></div>
    <div class="left flexCenterBoth">
      <i class="el-icon-arrow-left addColorBorder"></i>
      <i class="el-icon-arrow-right addColorBorder"></i>
      <div id="serchInput">
        <div class="inputSpan">
          <input type="text" class="input" placeholder="音乐/视频/电台/用户"/>
          <i class="el-icon-search serchIcon"></i>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="userLoginIn" style='margin-right:9px'>
        <i class="el-icon-user"></i>
      </div>
      <span style="font-size:8px">未登录</span>
      <i class="el-icon-caret-bottom" style='margin:0px 9px'></i>
      <span style="font-size:8px">开通VIP</span>
      <i class="el-icon-magic-stick icon"></i>
      <i class="el-icon-message icon"></i>
      <i class="el-icon-setting icon"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import HomePageContent from "@/components/HomePageContent.vue";
import router from '../router';

@Component
export default class HomePageTopbar extends Vue {
  goBackToHome(){
    router.push('/')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.wYIcon {
  cursor: pointer;
  background-image: url(https://s2.music.126.net/style/web2/img/frame/topbar.png?7d1d5d8e4f00cc5d6143ca737b681a88);
  background-repeat: no-repeat;
}

.flexCenterBoth {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  #serchInput {
    height: 80%;
    margin-left: 10px;
    width: 217px;
    border-radius: 50px 50px;
    background: rgb(22, 22, 24);
    .inputSpan {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 100%;
      position: relative;
      padding: 0 31px 0 12px;
      .input {
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        background: rgb(22, 22, 24);
        color: white;
        border: 0;
        outline: none;
      }
      .serchIcon {
        position: absolute;
        right: 8px;
      }
      .serchLabel {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
}
.addColorBorder {
  border: 1px solid rgb(23, 23, 26);
  padding: 2px 4px;
}
#topbar {
  height: 100%;
  width: 100%;
  background: rgb(33, 33, 36);
  color: white;
  display: flex;
  padding: 8px 18px;
  box-sizing: border-box;
  align-items: center;
  position: relative;
  .iconTitle {
    width: 180px;
    height: 30px;
    background-size: 100%;
    background-position: 10px -10px;
  }
  .right{
    position: absolute;
    right: 18px;
    display: flex;
    align-items: center;
    .userLoginIn{
      width: 22px;
      height: 22px;
      border-radius: 50px;
      background-color: rgb(225, 227, 228);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon{
      margin:0px 15px
    }
  }
}
</style>
