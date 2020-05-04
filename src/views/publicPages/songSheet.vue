<template>
  <div class="song-sheet-border">
    <div id="top-brief">
      <div class="img-border">
        <img :src="detailInfo.playlist.coverImgUrl" />
      </div>
      <div class="info-list">
        <div class="sheet-info">
          <div class="sheet-name">
            <span>歌单</span>
            <div>
              <span>{{detailInfo.playlist.name}}</span>
            </div>
          </div>
          <div class="num-info">
            <div>
              歌曲数
              <div>{{detailInfo.playlist.trackCount}}</div>
            </div>
            <div class="line"></div>
            <div>
              播放数
              <div>{{getPlayCount(detailInfo.playlist.playCount)}}</div>
            </div>
          </div>
        </div>
        <div class="creator">
          <div class="creator-avatar">
            <el-avatar size="small" :src="detailInfo.playlist.creator.avatarUrl"></el-avatar>
          </div>
          <div class="creator-name">{{detailInfo.playlist.creator.nickname}}</div>
          <div class="create-time">{{this.getCreatTime(detailInfo.playlist.createTime)}}创建</div>
        </div>
        <div class="action-lists">
          <div>
            <i class="el-icon-video-play"></i> 播放全部
          </div>
          <div>
            <i class="el-icon-folder-add"></i>
            收藏({{detailInfo.playlist.subscribedCount}})
          </div>
          <div>
            <i class="el-icon-share"></i>
            分享({{detailInfo.playlist.shareCount}})
          </div>
          <div>
            <i class="el-icon-download"></i> 下载全部
          </div>
        </div>
        <div class="tags">
          标签:
          <span v-for="(item,index) in detailInfo.playlist.tags" :key="index">{{item}}</span>
        </div>
        <div class="brief">
          <div :style="'flex:1 1 auto'">
            简介:
            <span v-html="getReduceLines(detailInfo.playlist.description)" v-if="desLines>1&&up"></span>
            <span v-html="getTotalLines(detailInfo.playlist.description)" v-if="!up"></span>
          </div>
          <i class="el-icon-arrow-down icon_bref" v-if="desLines>1&&up" @click="changeUpState"></i>
          <i class="el-icon-arrow-up icon_bref" v-if="desLines>1&&!up" @click="changeUpState"></i>
        </div>
      </div>
    </div>
    <div class="songList">
      <div class="songList-top">
        <div class="song-list-title">
          <a id="song-list" href="#song-list">歌曲列表</a>
          <a id="comment" href="#comment">评论({{commentNums}})</a>
          <a id="collection" href="#collection">收藏者</a>
        </div>
        <div class="songList-search">
          <el-input v-model="input" placeholder="搜索歌单音乐" size="mini"></el-input>
          <i class="el-icon-search serchIcon"></i>
        </div>
      </div>

      <SongList
        :data="songList"
        :column="column"
        v-if="songList.length>0"
        :outSideClientHeight="songListEffectClientHeight"
        :outSideOffsetHeight="songListEffectOffsetHeight"
        :relativeDom="songListRalativeDom"
        :colClick="getMusicUrl"
      />
    </div>
  </div>
</template>
<script>
// 遗留问题那条细线没有画
import moment from "moment";
import SongList from "@/components/SongList.vue";
import { baseUrl } from "@/utiles/ip";
export default {
  components: {
    SongList
  },
  data() {
    return {
      //up用来判断简介内容多行是，扩展图标朝向
      up: false,
      songList: [],
      input: "",
      desLines: 0,
      commentNums: 0,
      detailInfo: {
        playlist: {
          creator: {},
          description: ""
        }
      },
      column: [
        {
          title: "序号",
          key: "num",
          col: 1,
          hiddenText: true,
          style: {
            "text-align": "right",
            "padding-right": "6px"
          },
          render: (record, index, preExit) => {
            return this.getIndex(index + preExit);
          }
        },
        {
          title: "操作",
          key: "action",
          col: 1
        },
        {
          title: "音乐标题",
          key: "name",
          dataIndex: "name",
          col: 7
        },
        {
          title: "歌手",
          key: "ar",
          dataIndex: "ar",
          col: 6,
          render: (record, index) => {
            return this.getSongerName(record.ar);
          }
        },
        {
          title: "专辑",
          key: "al",
          dataIndex: "al",
          col: 5,
          render: record => {
            return record.al.name;
          },
          sort: (pre, next) => {
            return pre.al.name.length - next.al.name.length;
          }
        },
        {
          title: "时长",
          dataIndex: "dt",
          key: "dt",
          col: 4,
          render: record => {
            return this.getTime(record.dt);
          },
          sort: (pre, next) => {
            return pre.dt - next.dt;
          }
        }
      ],
      // 歌单展示组件中所需，一个为滑块的相对挂载dom，一个为影响可视区域的高德，一个为影响滑块加载判断的高度
      songListRalativeDom: null,
      songListEffectClientHeight: 0,
      songListEffectOffsetHeight: 0
    };
  },

  mounted() {
    this.songListRalativeDom = document.getElementById("content");
    this.songListEffectClientHeight =
      document.getElementById("topbar").clientHeight +
      document.getElementById("music-player").clientHeight;
    this.songListEffectOffsetHeight =
      document.getElementById("top-brief").clientHeight + 30;

    const {
      params: { id }
    } = this.$route;
    const vm = this;
    fetch(`${baseUrl}/playlist/detail?id=${id}`)
      .then(res => {
        return Promise.resolve(res.json());
      })
      .then(function(res) {
        if (res.code === 200) {
          vm.detailInfo = res;
          vm.songList = res.playlist.tracks;
          vm.checkLines(res.playlist.description);
        }
      });
    fetch(`${baseUrl}/comment/playlist?id=${id}`)
      .then(res => {
        return Promise.resolve(res.json());
      })
      .then(function(res) {
        if (res.code === 200) {
          vm.commentNums = res.total;
        }
      });
  },

  updated() {
    this.songListEffectOffsetHeight =
      document.getElementById("top-brief").clientHeight + 30;
  },

  methods: {
    getCreatTime(time) {
      return moment(time).format("YYYY-MM-DD");
    },
    getPlayCount(number) {
      return number / 10000 > 0 ? `${parseInt(number / 10000)}万` : number;
    },
    changeUpState() {
      this.up = !this.up;
    },
    //需要记录一下换行符的个数
    checkLines(str) {
      const reg = /(\r\n|\n|\r)/;
      let num = 0;
      while (str.match(reg) != null) {
        this.desLines++;
        str = str.replace(/(\r\n|\n|\r)/, "<br />");
        num++;
        if (num > 1) {
          this.up = true;
        }
      }
    },
    getTotalLines(str) {
      return str.replace(/(\r\n|\n|\r)/gm, "<br />");
    },
    //当换行数大于1（也就是说至少有三行）
    getReduceLines(str) {
      let first_str = str.replace(/(\r\n|\n|\r)/gm, "<br />");
      let str_arr = first_str.split("<br />");
      return str_arr[0] + "<br />" + str_arr[1] + "...";
    },
    getIndex(index) {
      return index < 9 ? `0${index + 1}` : index + 1;
    },
    getSongerName(arr) {
      let res = "";
      for (let i = 0; i <= arr.length - 1; i++) {
        i < arr.length - 1
          ? (res += arr[i].name + " / ")
          : (res += arr[i].name);
      }
      return res;
    },
    getTime(time) {
      let time_to_s = parseInt(time / 1000);
      let time_m = parseInt(time_to_s / 60); //分
      let time_s = time_to_s % 60; //秒
      const tStr = time_m < 10 ? "0" : "1";
      const sStr = time_s < 10 ? "0" : "1";
      switch (tStr + sStr) {
        case "11":
          return `${time_m}:${time_s}`;
        case "10":
          return `${time_m}:0${time_s}`;
        case "01":
          return `0${time_m}:${time_s}`;
        case "00":
          return `0${time_m}:0${time_s}`;
      }
    },
    getMusicUrl(record) {
      this.$store.commit({
        type: "changeSourceLoading",
        payload: true
      });
      this.$store.dispatch({
        type: "getMusicUrl",
        id: record.id
      });
      this.$store.dispatch({
        type: "getMusicSource",
        id: record.id
      });
    }
  }
};
</script>

<style lang="less">
#top-brief {
  font-size: 13px;
  display: flex;
  margin: 20px 20px 50px 20px;
  > div {
    margin: 10px;
  }
  .img-border {
    width: 200px;
    padding-bottom: 200px;
    flex: 0 0 auto;
    position: relative;
    > img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
  }
  .info-list {
    color: rgb(220, 221, 228);
    width: 100%;
    text-align: left;
    > div {
      margin-bottom: 10px;
    }
    .sheet-info {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      > div {
        font-size: 24px;
      }
      .sheet-name {
        display: flex;
        align-items: center;
        > span {
          font-size: 6px;
          color: rgb(201, 41, 41);
          border: 1px solid red;
          border-radius: 3px;
          padding: 2px 5px;
          margin-right: 10px;
        }
      }
      .num-info {
        font-size: 8px;
        display: flex;
        text-align: right;
        color: #828385;
        .line {
          background-color: #828385;
          width: 1px;
          margin: 0px 10px;
        }
      }
    }
    .creator {
      display: flex;
      align-items: center;
      color: rgb(130, 131, 133);
      .creator-avatar {
        cursor: pointer;
        margin-right: 10px;
      }
      .creator-avatar:hover {
        color: white;
      }
      .creator-name {
        font-size: 18px;
        cursor: pointer;
        margin-right: 15px;
      }
      .creator-name:hover {
        color: white;
      }
    }
    .action-lists {
      display: flex;
      > div {
        padding: 5px 8px;
        background-color: rgb(37, 39, 43);
        border-radius: 5px;
        margin-right: 10px;
      }
      > div:first-child {
        background-color: rgb(201, 41, 41);
      }
    }
    .tags {
      font-size: 12px;
      > span {
        color: rgb(44, 122, 209);
      }
      :not(:last-child)::after {
        content: " / ";
        color: white;
      }
    }
    .brief {
      font-size: 12px;
      position: relative;
      display: flex;
      .icon_bref {
        cursor: pointer;
      }
    }
  }
}
.songList {
  margin-bottom: 80px;
}
.songList-top {
  display: flex;
  justify-content: space-between;
  padding-bottom: 6px;
  .song-list-title {
    display: flex;
    > a {
      display: block;
      margin: 0 20px;
      cursor: pointer;
      position: relative;
      text-decoration: none;
      color: rgb(173, 175, 178);
    }
    > a:target::before {
      position: absolute;
      width: 100%;
      bottom: -6px;
      left: 0;
      height: 4px;
      background: rgb(184, 37, 37);
      content: "";
    }
  }
  .songList-search {
    display: flex;
    align-items: center;
    border-radius: 50px;
    background: rgb(32, 34, 38);
    padding: 0px 10px 0px 15px;
    input {
      padding: 0;
      height: 24px;
      line-height: 24px;
      background: rgb(32, 34, 38);
      outline: none;
      border: 0;
      outline: none;
      color: white;
    }
  }
}
.songList-table {
  .table-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    color: rgb(130, 131, 133);
    font-size: 13px;
    align-items: flex-start;
    .table-title {
      border-right: 1px solid rgb(130, 131, 133);
      border-top: 1px solid rgb(130, 131, 133);
      border-bottom: 1px solid rgb(130, 131, 133);
    }
    .table-title-last {
      border-top: 1px solid rgb(130, 131, 133);
      border-bottom: 1px solid rgb(130, 131, 133);
    }
    .table-white {
      background: rgb(35, 34, 41);
    }
    > div > div {
      padding: 4px 5px;
      height: 20px;
      line-height: 20px;
    }
    #index {
      flex: 0 0 auto;
      text-align: right;
      #blackDiv {
        height: 20px;
        width: 40px;
      }
    }
    #action {
      flex: 0 0 auto;
    }
    #title {
      flex: 3 1 auto;
    }
    #songer {
      flex: 2 1 auto;
    }
    #album {
      flex: 2 1 auto;
    }
    #time {
      flex: 1 1 auto;
    }
  }
}
</style>