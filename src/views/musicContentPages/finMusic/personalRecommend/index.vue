<template>
  <div>
    <div class="carousel">
      <el-carousel :interval="40000" type="card" height="185px">
        <el-carousel-item v-for="(item,index) in templateShow" :key="index">
          <img :src="item.imageUrl" class="img" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="title">
      <span>推荐歌单</span>
      <span>
        更多
        <i class="el-icon-arrow-right"></i>
      </span>
    </div>
    <div class="recommendSongs">
      <div
        v-for="(item,index) in recommendSongs"
        :key="index"
        class="recommendBorder"
        @click="goToSongSheet(item.id)"
      >
        <img :src="item.picUrl" />
        <span>{{item.name}}</span>
        <div class="hoverBorder">
          <div class="playCount">
            <i class="el-icon-headset"></i>
            {{getPlayCount(item.playCount)}}
          </div>
          <div>
            <p class="reson">{{item.copywriter}}</p>
          </div>
          <div class="playIcon"></div>
        </div>
      </div>
    </div>
    <div class="title">
      <span>独家放送</span>
      <span>
        更多
        <i class="el-icon-arrow-right"></i>
      </span>
    </div>
    <div class="specialShow">
      <div v-for="(item,index) in specialShow" :key="index" class="border">
        <div class="camera">
          <img src="../../../../../src/assets/camera.png" :width="40" :height="35" />
        </div>
        <img :src="item.picUrl" />
        <span>{{item.name}}</span>
      </div>
    </div>
    <div class="title">
      <span>最新音乐</span>
      <span>
        更多
        <i class="el-icon-arrow-right"></i>
      </span>
    </div>
    <div class="newestMusic">
      <div v-for="(item,index) in newMusic" :key="index" class="musicItem">
        <div class="musicItemLeft">{{index+1}}</div>
        <div class="musicItemRight">
          <div class="musicImg">
            <img :src="item.picUrl" />
          </div>
          <div class="musicInfo">
            <div>
              {{item.name}}
              <span
                style="color:gray"
              >{{item.song.alias.length>0?`(${item.song.alias[0]})`:''}}</span>
            </div>
            <div :title="getSongerName(item.song.artists)">{{getSongerName(item.song.artists)}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Loading } from "element-ui";
import baseUrl from "@/utiles/ip";
export default {
  data() {
    return {
      templateShow: [], //这也就是最上面的轮播图暂时数据，没有找到究竟是哪一个接口就以这个展示
      recommendSongs: [],
      specialShow: [], // 独家放送
      newMusic: [], // 最新音乐
    };
  },

  mounted() {
    //loading效果开启
    let loadingInstance = Loading.service({
      target: "#init_content",
      background: "rgba(25, 27, 31, 1)",
    });
    const vm = this;
    //轮播信息获取
    fetch(`${baseUrl}/banner`)
      .then((res) => {
        return Promise.resolve(res.json());
      })
      .then(function (res) {
        if (res.code === 200) {
          vm.templateShow = res.banners;
          loadingInstance.close();
        }
      });
    //推荐歌单获取
    fetch(`${baseUrl}/personalized?limit=10`)
      .then((res) => {
        return Promise.resolve(res.json());
      })
      .then(function (res) {
        if (res.code === 200) {
          vm.recommendSongs = res.result;
        }
      });
    //独家放送
    this.$axios.get("/personalized/privatecontent").then((res) => {
      vm.specialShow = res.result;
    });
    //最新音乐
    this.$axios.get("/personalized/newsong").then((res) => {
      vm.newMusic = res.result;
    });
  },

  methods: {
    getPlayCount(num) {
      let str;
      num / 100000 > 0 ? (str = `${(num / 10000).toFixed()}万`) : (str = num);
      return str;
    },
    goToSongSheet(id) {
      this.$router.push(`/side/songSheet/${id}`);
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
  },
};
</script>
<style lang="less" scoped>
@import "./index.less";
</style>