<template>
  <div>
    <div class="top">
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
          简介:
          <span v-html="getReduceLines(detailInfo.playlist.description)" v-if="desLines>1&&up"></span>
          <span v-html="getTotalLines(detailInfo.playlist.description)" v-if="!up"></span>
          <i class="el-icon-arrow-down icon_bref" v-if="desLines>1&&up" @click="changeUpState"></i>
          <i class="el-icon-arrow-up icon_bref" v-if="desLines>1&&!up" @click="changeUpState"></i>
        </div>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      //up用来判断简介内容多行是，扩展图标朝向
      up: false,
      desLines: 0,
      detailInfo: {
        playlist: {
          creator: {}
        }
      }
    };
  },
  mounted() {
    const {
      params: { id }
    } = this.$route;
    const vm = this;
    fetch(`http://localhost:3000/playlist/detail?id=${id}`)
      .then(res => {
        console.log(res);
        return Promise.resolve(res.json());
      })
      .then(function(res) {
        if (res.code === 200) {
          vm.detailInfo = res;
          vm.checkLines(res.playlist.description);
        }
      });
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
        if(num>1){
          this.up=true;
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
      let res = "";
      for (let i = 0; i < 2; i++) {
        res += str_arr[i] + "<br />";
      }
      return res;
    }
  }
};
</script>

<style scoped lang="less">
.top {
  font-size: 13px;
  margin: 20px 20px 50px 20px;
  display: flex;
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
        content: "/";
        color: white;
      }
    }
    .brief {
      font-size: 12px;
      position: relative;
      .icon_bref {
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
}
</style>