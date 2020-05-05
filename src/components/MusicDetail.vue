<template>
  <div class="music-detail">
    <div class="small-size" @click="goBig">
      <img :src="detail.al.picUrl" :width="initHeight" :height="initHeight" />
      <div id="info">
        <div :title="detail.name">{{detail.name}}</div>
        <div :title="getSongerName(detail.ar)">{{getSongerName(detail.ar)}}</div>
      </div>
      <img
        src="../../src/assets/fullScreen.png"
        :width="initHeight-10"
        :height="initHeight-10"
        class="fullScreen"
      />
    </div>
    <div id="big-size">
      <div class="big-screen-border">
        <div class="go-small-icon">
          <img src="../../src/assets/shrink.png" :width="40" :height="35" @click="goSmall" />
        </div>
        <div class="top">
          <div class="top-filter"></div>
          <div class="top-left">
            <div class="single-cover">
              <div class="single-cover-img">
                <img :src="this.detail.al.picUrl" />
              </div>
            </div>
            <div class="left-icon-list">
              <div>
                <i class="el-icon-thumb"></i>喜欢
              </div>
              <div>
                <i class="el-icon-folder-add"></i>收藏
              </div>
              <div>
                <i class="el-icon-download"></i>下载
              </div>
              <div>
                <i class="el-icon-paperclip"></i>分享
              </div>
            </div>
          </div>
          <div class="top-right">
            <p class="right-title">{{detail.name}}</p>
            <div class="right-music-info">
              <p>
                专辑：
                <span :title="detail.al.name">{{detail.al.name}}</span>
              </p>
              <p>
                歌手：
                <span :title="getSongerName(detail.ar)">{{getSongerName(detail.ar)}}</span>
              </p>
              <p>
                来源：
                <span>每日歌曲推荐</span>
              </p>
            </div>
            <span v-html="checkLines(lyric)"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Loading } from "element-ui";
import { baseUrl } from "@/utiles/ip";
import _ from "lodash";
export default {
  props: {
    musicDetail: {
      // 通过是否处于大屏状态控制 请求发送优化,但是因为网易云的那个图标也可以关闭大屏状态，所以移动到stroe中
      // bigScreenStatus: false,
      type: Object,
      required: true
    }
  },

  data() {
    return {
      // 初始化高度用来设置图片展示的大小
      initHeight: 0,
      lyric: "",
      simiSongs: [],
      songComment: []
    };
  },
  mounted() {
    this.initHeight = document.getElementById("musicDetail").clientHeight;
    document.getElementById("info").style.width =
      document.getElementById("musicDetail").clientWidth -
      this.initHeight -
      15 +
      "px";
  },
  computed: {
    detail: function() {
      return this.musicDetail;
    },
    id: function() {
      return this.musicDetail.id;
    }
  },
  watch: {
    id: function() {
      document.getElementsByClassName(
        "top-filter"
      )[0].style.backgroundImage = `url(${this.musicDetail.al.picUrl})`;
      if (this.$store.state.isMusicPlayInBigScreen) {
        this.allSettled(this.musicDetail.id);
      }
    }
  },
  methods: {
    getSongerName(arr) {
      let res = "";
      for (let i = 0; i <= arr.length - 1; i++) {
        i < arr.length - 1
          ? (res += arr[i].name + " / ")
          : (res += arr[i].name);
      }
      return res;
    },
    goBig() {
      const totalWidth = document.documentElement.clientWidth;
      const totalHeight = document.documentElement.clientHeight;
      document.getElementById("big-size").style.width = "100vw";
      // 减去的100 为播放器和头部的高度
      document.getElementById("big-size").style.height = "calc(100vh - 100px)";
      setTimeout(() => {
        document.getElementById("big-size").style.transition = "all 0s";
      }, 600);
      this.allSettled(this.detail.id);
      this.$store.commit({
        type: "changeBigScreenStatus",
        payload: true
      });
    },
    goSmall() {
      const bigScreen = document.getElementById("big-size");
      bigScreen.style.width = "0px";
      bigScreen.style.height = "0px";
      bigScreen.style.transition = "all 0.4s";
      bigScreen.style.transitionDelay = "0.2s";
      this.$store.commit({
        type: "changeBigScreenStatus",
        payload: false
      });
    },
    // 歌词换行
    checkLines(str) {
      const reg = /\](.+?)(\r\n|\n|\r)/gm;
      let useP = "";
      this.lyric.replace(reg, function(match, param, offset, string) {
        useP += `<p>${param}</p>`;
      });
      return useP;
    },
    // 合成一下请求，等这些请求都结束之后才撤销loading状态
    allSettled(id) {
      let loadingInstance = Loading.service({
        background: "rgb(25, 27, 31)"
      });
      Promise.allSettled([
        this.getSimiSongs(id),
        this.getMusicComment(id),
        this.getMusicLyric(id)
      ]).then(() => {
        loadingInstance.close();
      });
    },
    getMusicLyric(id) {
      const vm = this;
      fetch(`${baseUrl}/lyric?id=${id}`)
        .then(res => {
          return Promise.resolve(res.json());
        })
        .then(function(res) {
          if (res.code === 200) {
            const {
              lrc: { lyric }
            } = res;
            vm.lyric = lyric;
          }
        });
    },
    getMusicComment(id) {
      const vm = this;
      fetch(`${baseUrl}/comment/music?id=${id}`)
        .then(res => {
          return Promise.resolve(res.json());
        })
        .then(function(res) {
          if (res.code === 200) {
            const { hotComments } = res;
            console.log(res, "评论");
            vm.songComment = hotComments;
          }
        });
    },
    getSimiSongs(id) {
      const vm = this;
      fetch(`${baseUrl}/simi/song?id=${id}`)
        .then(res => {
          return Promise.resolve(res.json());
        })
        .then(function(res) {
          if (res.code === 200) {
            console.log(res, "歌");
            const { songs } = res;
            vm.simiSongs = songs;
          }
        });
    }
  }
};
</script>

<style lang="less" scoped>
.music-detail {
  background: rgb(25, 27, 31);
  color: rgb(179, 174, 174);
  width: 100%;
  .small-size {
    padding: 5px;
    display: flex;
    border: 1px solid rgb(54, 55, 56);
    .fullScreen {
      display: none;
      padding: 5px;
      background: rgba(1, 1, 1, 0.5);
      position: absolute;
    }
    img {
      position: relative;
      margin-right: 10px;
    }
    #info {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
    #info div {
      width: 100%;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .small-size:hover {
    cursor: pointer;
    .fullScreen {
      display: block;
    }
  }
  #big-size {
    // z-index: 99;
    // display: none;
    background: rgb(22, 24, 28);
    transition: all 0.4s;
    transition-delay: 0.2s;
    transition-timing-function: ease-in;
    position: fixed;
    width: 0;
    height: 0;
    bottom: 50px;
    left: 0;
    .big-screen-border {
      min-width: 960px;
      width: 50%;
      margin: 0 auto;
      box-sizing: border-box;
      padding: 0px 36px;
      position: relative;
      @media screen and (max-width: 1380px) {
        width: 80%;
      }
      .go-small-icon {
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 0;
        @media screen and (max-width: 1380px) {
          // right: 10%;
        }
      }
      .top {
        height: 50vh;
        display: flex;
        justify-content: space-between;
        margin: 50px 20px;
        position: relative;
      }
      .top-filter {
        z-index: -1;
        width: 100vw;
        opacity: 0.3;
        height: 50vh;
        filter: blur(100px);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .top-left {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .single-cover {
          border-radius: 50%;
          animation: rotate 20s linear infinite;
          box-shadow: 0px 0px 2px 6px rgb(62, 62, 66);
          width: 350px;
          height: 350px;
          background-image: url(../../src/assets/singlecover.png);
          background-repeat: no-repeat;
          background-size: 100% 100%;
          .single-cover-img {
            padding: 50px;
            img {
              width: 250px;
              height: 250px;
              border-radius: 50%;
              border: 1px solid white;
            }
          }
        }
        .left-icon-list {
          display: flex;
          justify-content: space-between;
          div {
            padding: 5px 10px;
            background: rgb(47, 51, 54);
            border-radius: 3px;
            i {
              margin-right: 5px;
            }
          }
        }
      }
      .top-right {
        width: 50%;
        height: 100%;
        overflow: auto;
        span {
          color: rgb(144, 148, 148);
        }
        .right-title {
          color: white;
          font-size: 22px;
        }
        .right-music-info {
          display: flex;
          justify-content: space-around;
          p {
            width: 30%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          span {
            color: #409eff;
          }
        }
      }
    }
  }
}
</style>