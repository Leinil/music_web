<template>
  <div class="outestBorder">
    <div id="topTabs">
      <div id="selfRecommend" class="checked">个性推荐</div>
      <div id="sheet">歌单</div>
      <div id="station">主播电台</div>
      <div id="list">排行榜</div>
      <div id="singers">歌手</div>
      <div id="newest">最新音乐</div>
    </div>
    <div id="init_content">
      <PersonalRecommend />
    </div>
  </div>
</template>
<script>
import PersonalRecommend from "./personalRecommend/index.vue";
export default {
  name: "home",
  components: {
    PersonalRecommend,
  },
  data() {
    return {
      loading: true,
      activeName: "selfRecommend",
      selected: "selfRecommend",
    };
  },
  mounted() {
    //添加对于顶部tab的事件监听
    let itemsPart = document.getElementById("topTabs");
    const that = this;
    itemsPart.addEventListener("click", function (e) {
      let obj = {};
      var event = e || window.event;
      var target = event.target || event.srcElement || obj;
      // 判断是否匹配目标元素
      if (
        target.nodeName.toLocaleLowerCase() === "div" &&
        target.id != "topTabs"
      ) {
        if (that.selected == target.id) return;
        target.classList.add("checked");
        if (that.selected != "") {
          let obj = {};
          const oldTarget = document.getElementById(that.selected) || obj;
          oldTarget.classList.remove("checked");
        }
        that.selected = target.id;
      }
    });
  },
};
</script>
<style scoped lang="less">
@media screen and(max-width: 1280px) {
  #init_content {
    width: 80%;
  }
}
@media screen and(min-width: 1280px) {
  #init_content {
    width: 60%;
  }
}
.outestBorder {
  overflow: auto;
  height: 100%;
}
#topTabs {
  display: flex;
  justify-content: center;
  margin: 0px 20px;
  border-bottom: 1px solid rgb(38, 40, 44);
  color: rgb(130, 131, 133);
}
#topTabs > div {
  position: relative;
  margin: 0 20px;
  padding: 11px 0px;
  min-width: 64px;
  cursor: pointer;
}
#topTabs > div:hover {
  color: white;
}
#init_content {
  min-height: 200px;
  margin: 0 auto;
}
.carousel {
  padding-top: 10px;
}
.el-carousel__item {
  width: 50%;
  min-width: 544px;
}
.el-carousel__item > img {
  width: 100%;
  height: 100%;
}
.checked {
  color: white;
}
.checked::before {
  bottom: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 2px;
  background: rgb(130, 131, 133);
  content: "";
}
</style>
