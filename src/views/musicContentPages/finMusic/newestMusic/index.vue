<template>
  <div class="newest_music_border">
    <div class="top_button">
      <div class="top_button_border">
        <div class="active">新歌速递</div>
        <div>新歌上架</div>
      </div>
    </div>
    <div class="song_type_line">
      <span @click="switchType('0')" :class="selectedType==='0'?'active':''">全部</span>
      <span @click="switchType('7')" :class="selectedType==='7'?'active':''">华语</span>
      <span @click="switchType('96')" :class="selectedType==='96'?'active':''">欧美</span>
      <span @click="switchType('16')" :class="selectedType==='16'?'active':''">韩国</span>
      <span @click="switchType('8')" :class="selectedType==='8'?'active':''">日本</span>
    </div>
    <div id="songlist">
      <div
        :class="[index%2===0 ? 'lighter' : '', 'song_list']"
        v-for="(song,index) in songList"
        :key="index"
        @click="getMusicUrl(song.id)"
      >
        <div>{{index+1}}</div>
        <div class="song_img">
          <img :src="ImageLazy" :data-src="song.album.blurPicUrl" alt />
        </div>
        <div>{{song.name}}</div>
        <div>{{getSongerNames(song.artists)}}</div>
        <div>{{song.album.name}}</div>
        <div>{{getTime(song.bMusic.playTime)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Loading } from "element-ui";
import ImageLazy from "@/assets/imageLazy.svg";
export default {
  data() {
    return {
      selectedType: "0",
      songList: [],
      ImageLazy,
    };
  },
  mounted() {
    this.getSongsListByType();
  },
  methods: {
    switchType(type) {
      this.selectedType = type;
      this.getSongsListByType(type);
    },
    getSongsListByType(type) {
      let loadingInstance = Loading.service({
        target: "#songlist",
        background: "rgba(25, 27, 31, 1)",
        text: "正在加载中",
      });
      this.songList = [];
      this.$axios
        .get(`/top/song?type=${type ? type : 0}`)
        .then((res) => {
          this.songList = res.data;
        })
        .then(() => {
          loadingInstance.close();
          const observer = new IntersectionObserver((items) => {
            items.forEach((element, index) => {
              const { target, isIntersecting } = element;
              if (isIntersecting) {
                target.src = target.getAttribute("data-src");
                observer.unobserve(target);
              }
            });
          });
          const beginObservered = Array.from(
            document.getElementsByTagName("img")
          );
          beginObservered.forEach((element) => observer.observe(element));
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