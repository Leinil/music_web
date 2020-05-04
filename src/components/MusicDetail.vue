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
      <div class="go-small-icon">
        <img src="../../src/assets/shrink.png" :width="40" :height="35" />
      </div>
      <div class="big-screen-border">
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
      type: Object,
      required: true
    }
  },

  data() {
    return {
      // 初始化高度用来设置图片展示的大小
      initHeight: 0,
      lyric: "",
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
  beforeUpdate() {
    document.getElementsByClassName(
      "top-filter"
    )[0].style.backgroundImage = `url(${this.musicDetail.al.picUrl})`;
    this.getMusicLyric(this.musicDetail.id);
  },
  computed: {
    detail: function() {
      return this.musicDetail;
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
      this.getMusicLyric(this.detail.id);
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
    getMusicLyric(id) {
      let loadingInstance = Loading.service({
        background: "rgb(25, 27, 31)"
      });
      const vm = this;
      fetch(`${baseUrl}/lyric?id=${id}`)
        .then(res => {
          return Promise.resolve(res.json());
        })
        .then(function(res) {
          if (res.code === 200) {
            loadingInstance.close();
            const {
              lrc: { lyric }
            } = res;
            vm.lyric = lyric;
          }
        });
    }
  }
};
</script>

<style lang="less" scoped>
.music-detail {
  background: rgb(25, 27, 31);
  color: white;
  font-size: 13px;
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
      width: 60%;
      margin: 0 auto;
      box-sizing: border-box;
      padding: 0px 36px;
      @media screen and (max-width: 1380px) {
        width: 80%;
      }
      .top {
        height: 50vh;
        display: flex;
        justify-content: space-between;
        margin: 50px 20px;
        position: relative;
      }
      .top-filter {
        width: 50%;
        height: 50%;
        filter: blur(80px);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .top-left {
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
          margin: 45px 0px;
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
        flex: 1 0 auto;
        height: 100%;
        overflow: auto;
      }
    }
    .go-small-icon {
      position: fixed;
      top: 10%;
      right: 20%;
      @media screen and (max-width: 1380px) {
        right: 10%;
      }
    }
  }
}
</style>