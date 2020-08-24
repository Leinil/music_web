<template>
  <div class="song_list_border">
    <div class="tags">
      热门标签 ：
      <span
        v-for="type in musicTypes"
        :key="type.id"
        class="music_type"
        @click="getMusicByType(type.name)"
      >{{type.name}}</span>
    </div>
    <div class="play_list">
      <div
        class="song_item"
        v-for="song in playLists"
        :key="song.id"
        @click="goToSongSheet(song.id)"
      >
        <div class='img_border'>
          <div class="playIcon"></div>
          <img :src="song.coverImgUrl" />
        </div>
        <div class="play_count">
          <i class="el-icon-headset"></i>
          {{getPlayCount(song.playCount)}}
        </div>
        <div class="song_name" :title="song.name">{{song.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      musicTypes: [],
      playLists: [],
    };
  },
  mounted() {
    const context = this;
    // 音乐分类
    this.$axios.get("/playlist/hot").then((res) => {
      context.musicTypes = res.tags;
    });
    this.getMusicByType();
  },
  methods: {
    getMusicByType(type) {
      const context = this;
      if (type) {
        this.$axios.get(`/top/playlist?cat=${type}`).then((res) => {
          context.playLists = res.playlists;
        });
        return;
      }
      this.$axios.get("/top/playlist").then((res) => {
        context.playLists = res.playlists;
      });
    },
    getPlayCount(num) {
      let str;
      num / 100000 > 0 ? (str = `${(num / 10000).toFixed()}万`) : (str = num);
      return str;
    },
    goToSongSheet(id) {
      this.$router.push(`/side/songSheet/${id}`);
    },
  },
};
</script>
<style lang="less" scoped>
@import "./index.less";
</style>