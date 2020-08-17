<template>
  <div id="sidebar">
    <div class="sideContentBlock">
      <div class="sideTitle">推荐</div>
      <div class="sideItems">
        <router-link to="/side/findMusic" id="findMusic">
          <i class="el-icon-headset"></i> 发现音乐
        </router-link>
        <router-link to="/side/selfFM" id="selfFM">
          <i class="el-icon-mic"></i>私人FM
        </router-link>
        <router-link to="/side/lookLive" id="lookLive">
          <i class="el-icon-video-camera-solid"></i>LOOK直播
        </router-link>
        <router-link to="/side/video" id="video">
          <i class="el-icon-video-camera"></i>视频
        </router-link>
        <router-link to="/side/friend" id="friend">
          <i class="el-icon-user"></i>朋友
        </router-link>
      </div>
    </div>
    <div class="sideContentBlock">
      <div class="sideTitle">我的音乐</div>
      <div class="sideItems">
        <router-link to="/side/localMusic" id="localMusic">
          <i class="el-icon-service"></i>本地音乐
        </router-link>
        <router-link to="/side/download" id="download">
          <i class="el-icon-download"></i>下载管理
        </router-link>
      </div>
    </div>
    <div class="sideContentBlock">
      <div class="sideTitle">创建的歌单</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import router from "../router";

@Component
export default class MusicPageSidebar extends Vue {
  name: string = "sideBar";
  selected: string = ""; //选择的侧边栏
  data() {
    return {};
  }

  mounted() {
    let itemsPart = document.getElementsByClassName("sideItems");
    let itemsArray = Array.prototype.slice.call(itemsPart, 0);
    const that = this;
    itemsArray.forEach((element: Element) => {
      element.addEventListener("click", function(e: Event) {
        let obj: { [name: string]: any } = {};
        var event = e || window.event;
        var target = event.target || event.srcElement || obj;
        // 判断是否匹配目标元素
        if (target.nodeName.toLocaleLowerCase() === "a") {
          if (that.selected == target.id) return;
          target.classList.add("checked");
          if (that.selected != "") {
            let obj: any = {};
            const oldTarget = document.getElementById(that.selected) || obj;
            oldTarget.classList.remove("checked");
          }
          that.selected = target.id;
          // that.$router.push(`/side-${target.id}`)
        }
      });
    });
  }
}
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
    margin: 6px 0px 6px 5px;
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
.checked {
  background: rgb(38, 40, 44);
}
.checked::before {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: red;
  width: 1%;
  content: "";
}
.sideItems a:last-child {
  margin-bottom: 19px;
}
.sideItems a i {
  margin: 0px 9px 0px 16px;
}
</style>
