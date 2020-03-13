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
      <div class="carousel">
        <el-carousel :interval="40000" type="card" height="185px">
          <el-carousel-item v-for="(item,index) in templateShow" :key="index">
            <img :src="item.picUrl" class="img" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="title">
        <span>推荐歌单</span>
        <span>
          更多
          <i class="el-icon-arrow-right"></i>
        </span>
      </div>
      <div class="recommendSongs">
        <div v-for="(item,index) in recommendSongs" :key="index" class="recommendBorder">
          <img :src="item.picUrl" />
          <span>{{item.name}}</span>
          <div class="hoverBorder">
            <div class="playCount">
              <i class="el-icon-headset"></i>
              {{getPlayCount(item.playCount)}}
            </div>
            <div>{{item.copywriter}}</div>
            <div class="playIcon"></div>
          </div>
        </div>
      </div>
      <div class="title">
        <span>独家放送</span>
        <span>
          更多
          <i class="el-icon-arrow-right"></i>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { Loading } from "element-ui";
import playBar from "../../src/assets/playbar.png";
export default {
  name: "home",
  data() {
    return {
      loading: true,
      activeName: "selfRecommend",
      selected: "selfRecommend",
      templateShow: [], //这也就是最上面的轮播图暂时数据，没有找到究竟是哪一个接口就以这个展示
      recommendSongs: []
    };
  },
  mounted() {
    //loading效果开启
    let loadingInstance = Loading.service({
      target: "#init_content",
      background: "rgba(25, 27, 31, 1)"
    });
    const vm = this;
    //滚动信息获取
    fetch("http://localhost:3000/personalized/privatecontent")
      .then(res => {
        return Promise.resolve(res.json());
      })
      .then(function(res) {
        if (res.code === 200) {
          vm.templateShow = res.result;
          loadingInstance.close();
        }
      });
    //推荐歌单获取
    fetch("http://localhost:3000/personalized?limit=10")
      .then(res => {
        return Promise.resolve(res.json());
      })
      .then(function(res) {
        if (res.code === 200) {
          vm.recommendSongs = res.result;
        }
      });
    //推荐歌单获取2434388371
    fetch("http://localhost:3000/song/detail?ids=441491828");
    fetch("http://localhost:3000/playlist/detail?id=2434388371");
    //添加对于顶部tab的事件监听
    let itemsPart = document.getElementById("topTabs");
    const that = this;
    itemsPart.addEventListener("click", function(e) {
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
  methods: {
    getPlayCount(num) {
      let str;
      num / 100000 > 0 ? (str = `${(num / 10000).toFixed()}万`) : (str = num);
      return str;
    }
  },
  watch: {}
};
</script>
<style scoped lang="less">
.outestBorder {
  overflow: auto;
  height: 100%;
}
.recommendSongs {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  font-size: 13px;
  .recommendBorder {
    width: 19%;
    padding-bottom: 19%;
    position: relative;
    margin: 10px 0px 65px 0px;

    .hoverBorder {
      cursor: pointer;
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
      .playCount {
        font-size: 10px;
        position: absolute;
        width: 100%;
        text-align: right;
        color: white;
        padding: 2px 10px;
        z-index: 9;
        transition: all 0.2s;
        transition-delay: 0.5s;
        transition-timing-function: cubic-bezier(0, 0, 1, 1);
        background-image: linear-gradient(
          90deg,
          transparent 50%,
          rgba(0, 0, 0, 0.5)
        );
        box-sizing: border-box;
        i {
          width: 10px;
          height: 10px;
          margin-right: 2px;
        }
      }
      div:nth-child(2) {
        position: absolute;
        top: -30%;
        text-align: left;
        color: white;
        font-size: 13px;
        width: 100%;
        padding: 9px;
        transition: all 0.2s;
        transition-delay: 0.5s;
        transition-timing-function: cubic-bezier(0, 0, 1, 1);
        box-sizing: border-box;
        background-color: rgba(32, 32, 32, 0.8);
        z-index: 99;
      }
      .playIcon {
        opacity: 0;
        width: 36px;
        height: 36px;
        // border:1px solid white;
        position: absolute;
        right: 2%;
        bottom: 2%;
        background-image: url(../../src/assets/playbar.png);
        background-repeat: no-repeat;
        background-position: 0 -204px;
        // background-size: 100% 100%;
      }
    }
    .hoverBorder:hover {
      .playCount {
        opacity: 0;
      }
      :nth-child(2) {
        top: 0;
      }
      .playIcon {
        opacity: 0.7;
      }
    }
    > span {
      position: absolute;
      left: 0;
      top: 102%;
      color: white;
      text-align: left;
    }
  }
  .recommendBorder > img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
}
.title {
  color: rgb(130, 131, 133);
  padding: 10px 0px;
  font-size: 13px;
  border-bottom: 0.5px solid rgb(35, 38, 44);
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  & > span:first-child {
    color: white;
    font-size: 18px;
  }
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
  width: 60%;
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
