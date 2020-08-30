<template>
  <div class="ranking">
    <div class="title">
      <span>官方榜</span>
    </div>
    <div class="offcial">
      <div class="rank" v-for="(value,name) in rankTopFive" :key="name">
        <div class="title">
          <!-- <div class="firstWord">{{name.substr(3,1)}}</div>
          <div class="otherWord">{{name.substr(4,2)}}</div> -->
          {{name}}
        </div>
        <div
          :class="['song',index%2===0?'single':'']"
          v-for="(song,index) in value"
          :key="index"
          @click="getMusicUrl(song.id)"
        >
          <span :style="{'color':index<3?'red':'rgb(130, 131, 133)'}">{{index+1}}</span>
          <div class="name" :title="song.name">{{song.name}}</div>
          <div class="auther" :title="getSongerName(song.ar)">{{getSongerName(song.ar)}}</div>
        </div>
        <div class="bottom">
          <span @click="goToSongSheet(rankTopFiveId[name])">查看全部 ></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rankTopFive: {},
      rankTopFiveId: {},
    };
  },

  mounted() {
    const list = {};
    // 这和是很多很多榜单的总和，取前五个展示
    this.$axios.get("/toplist").then((res) => {
      const topFiveId = {};
      const topTreeAsync = res.list.slice(0, 5).map((item) => {
        topFiveId[item.name] = item.id;
        return this.$axios.get(`/playlist/detail?id=${item.id}`);
      });
      this.rankTopFiveId = topFiveId;
      Promise.all(topTreeAsync).then((res) => {
        console.log(res);
        res.map((item) => {
          const name = item.playlist.name;
          const topEight = item.playlist.tracks.slice(0, 8); //获取前八首歌
          list[name] = topEight;
        });
        this.rankTopFive = list;
      });
    });
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
    noUrl() {
      this.$notify({
        title: "资源获取失败",
        message: "因版权或VIP问题无法获取资源~~",
        type: "warning",
      });
    },
    getMusicUrl(id) {
      this.$store.commit({
        type: "changeSourceLoading",
        payload: true,
      });
      // 获取播放的url资源
      this.$store.dispatch({
        type: "getMusicUrl",
        id,
        noUrlCallback: this.noUrl,
      });
    },
    goToSongSheet(id) {
      this.$router.push(`/side/songSheet/${id}`);
    },
  },
};
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>