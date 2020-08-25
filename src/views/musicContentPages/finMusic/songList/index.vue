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
        v-for="(song,index) in playLists"
        :key="index"
        @click="goToSongSheet(song.id)"
      >
        <div class="img_border">
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
    <div class="bottom_pagination">
      <el-pagination
        :background="true"
        :current-page="currentPage"
        :page-size="50"
        :pager-count="9"
        layout="prev, pager, next"
        :total="total"
        @current-change="(current)=>getMusicByType(musicType,current-1)"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { Loading } from "element-ui";
export default {
  data() {
    return {
      musicTypes: [], //总共的音乐类型
      playLists: [],
      musicType: "", //切换选中的音乐类型
      total: 0,
      currentPage: 1,
    };
  },
  mounted() {
    const context = this;
    // 音乐分类
    this.$axios.get("/playlist/hot").then((res) => {
      context.musicTypes = res.tags;
      context.musicType = res.tags[0].name;
    });
    this.getMusicByType();
  },
  methods: {
    getMusicByType(type, offset) {
      this.musicType = type;
      const context = this;
      const loadingInstance = Loading.service({
        target: ".play_list",
        background: "rgba(25, 27, 31, 1)",
      });
      if (!offset) {
        context.currentPage = 1;
      } else {
        context.currentPage = offset + 1;
      }
      if (type) {
        this.$axios
          .get(
            `/top/playlist?cat=${type}${offset ? `&offset=${offset * 50}` : ""}`
          )
          .then((res) => {
            context.playLists = res.playlists;
            context.total = res.total;
            loadingInstance.close();
          });
        return;
      }
      this.$axios
        .get(`/top/playlist${offset ? `?offset=${offset * 50}` : ""}`)
        .then((res) => {
          context.playLists = res.playlists;
          context.total = res.total;
          loadingInstance.close();
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