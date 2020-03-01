<template>
  <div id="sidebar">
    <div class="sideContentBlock">
      <div class="sideTitle">推荐</div>
      <div class="sideItems">
        <a href="#findMusic" id="findMusic">
          <i class="el-icon-headset"></i> 发现音乐
        </a>
        <a href="#selfFM" id="selfFM">
          <i class="el-icon-mic"></i>私人FM
        </a>
        <a href="#lookLive" id="lookLive">
          <i class="el-icon-video-camera-solid"></i>LOOK直播
        </a>
        <a href="#video" id="video">
          <i class="el-icon-video-camera"></i>视频
        </a>
        <a href="#friend" id="friend">
          <i class="el-icon-user"></i>朋友
        </a>
      </div>
    </div>
    <div class="sideContentBlock">
      <div class="sideTitle">我的音乐</div>
      <div class="sideItems">
        <a href="#localMusic" id="localMusic">
          <i class="el-icon-service"></i>本地音乐
        </a>
        <a href="#download" id="download">
          <i class="el-icon-download"></i>下载管理
        </a>
      </div>
    </div>
    <div class="sideContentBlock">
      <div class="sideTitle">创建的歌单</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class HomePageSidebar extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
#sidebar {
  height: 100%;
  width: 100%;
  color: rgb(173, 175, 178);
  text-align: initial;
  font-size: 13px;
}
.sideContentBlock {
  .sideTitle {
    margin: 6px 0px 6px 10px;
  }
}

.sideItems a {
  display: flex;
  position: relative;
  align-items: center;
  padding: 6px 0px;
  text-decoration: none;
  color: rgb(173, 175, 178);
  // justify-content: space-between;
}
.sideItems a:hover {
  color: white;
  cursor: pointer;
}
.sideItems a:target {
  background: rgb(38, 40, 44);
  outline: none; // 去除选中状态边
}
.sideItems a:target::before {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: red;
  width: 1%;
  content: ''
}
.sideItems a:last-child {
  margin-bottom: 19px;
}
.sideItems a i {
  margin: 0px 9px 0px 16px;
}
</style>
