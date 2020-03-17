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
            <div>{{detailInfo.playlist.name}}</div>
          </div>
          <div class="num-info">
            <div>
              歌曲数
              <div>51</div>
            </div>
            <div class="line"></div>
            <div>
              播放数
              <div>53万</div>
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
        <div class="tags"></div>
        <div class="brief"></div>
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
        }
      });
  },
  methods: {
    getCreatTime(time) {
      return moment(time).format("YYYY-MM-DD");
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
      height: 100%;
    }
  }
  .info-list {
    color: rgb(220, 221, 228);
    width: 100%;
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
          color: red;
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
        background-color: red;
      }
    }
  }
}
</style>