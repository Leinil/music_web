<template>
  <div class="newest_music_border">
    <div class="top_button">
      <div class="top_button_border">
        <div class="active">新歌速递</div>
        <div>新歌上架</div>
      </div>
    </div>
    <div class="song_type_line">
      <span class="active">全部</span>
      <span>华语</span>
      <span>欧美</span>
      <span>韩国</span>
      <span>日本</span>
    </div>
    <div
      :class="[index%2===0 ? 'lighter' : '', 'song_list']"
      v-for="(song,index) in songList"
      :key="index"
      @click="getMusicUrl(song.id)"
    >
      <div>{{index+1}}</div>
      <div class="song_img">
        <img :src="song.album.blurPicUrl" alt />
      </div>
      <div>{{song.name}}</div>
      <div>{{getSongerNames(song.artists)}}</div>
      <div>{{song.album.name}}</div>
      <div>{{getTime(song.bMusic.playTime)}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      songList: [],
    };
  },
  mounted() {
    this.getSongsListByType();
  },
  methods: {
    getSongsListByType(type) {
      this.$axios.get(`/top/song?type=${type ? type : 0}`).then((res) => {
        this.songList = res.data.slice(0, 10);
      });
    },
    getSongerNames(data) {
      let str = "";
      data.forEach((element, index, arr) => {
        index < arr.length - 1
          ? (str += element.name + "/")
          : (str += element.name);
      });
      return str;
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
  },
};
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>