<template>
  <div id="music-player">
    <div class="left-buttons">
      <div class="previous"></div>
      <div class="wait" v-if="!loading&&pauseStatus" @click="play"></div>
      <div class="play" v-if="!loading&&currentPlayUrl!==''&&playStatus" @click="pause"></div>
      <div class="sourceLoading" v-if="loading"></div>
      <div class="next"></div>
    </div>
    <div class="time-sound">
      <div v-if="!currentPlayDetail">00:00</div>
      <div v-if="currentPlayDetail">{{getTime(timeRuned)}}</div>
      <div id="time-background">
        <div id="red-road-col"></div>
        <div id="white-ball-col">
          <div id="red-ball"></div>
        </div>
      </div>
      <div v-if="!currentPlayDetail">00:00</div>
      <div v-if="currentPlayDetail">{{getTime(totalTime)}}</div>
      <div class="sound-icon"></div>
      <div class="sound-background"></div>
    </div>
    <div class="songs-control">
      <div class="play-kind"></div>
      <div class="hz">极高</div>
      <div class="song-list-icon"></div>
    </div>
    <audio ref="audio" :src="currentPlayUrl" autoplay="autoplay" v-if="currentPlayUrl!==''"></audio>
  </div>
</template>

<script>
import playerIcon from "@/assets/playbar.png";
export default {
  data() {
    return {
      timeRuned: 0,
      totalTime: 0,
      timer: null,
      pauseStatus: true,
      playStatus: false,
      timeMovebegin: 0,
      timeMoveDistance: 0,
      currentWidth: 0
    };
  },

  mounted() {
    const whiteBall = document.getElementById("white-ball-col");
    whiteBall.addEventListener("mousedown", this.mouseDown, false);
  },

  computed: {
    loading: function() {
      return this.$store.state.sourceLoading;
    },
    musicSourceList: function() {
      return this.$store.state.sourceList;
    },
    currentPlayUrl: function() {
      return this.$store.state.currentPlayingMusicUrl;
    },
    currentPlayDetail: function() {
      if (this.$store.state.sourceList.length) {
        const detail = this.$store.state.sourceList[
          this.$store.state.sourceList.length - 1
        ];
        return detail;
      }
      return null;
    }
  },

  watch: {
    currentPlayUrl: function(newUrl, oldUrl) {
      this.timeRuned = 0;
      this.timeMoveDistance = 0;
      this.playStatus = true;
      this.pauseStatus = false;
    },
    currentPlayDetail: function(newObj, oldObj) {
      this.totalTime = parseInt(newObj.dt / 1000);
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.timeRuned += 1;
        const totalLong = document.getElementById("time-background")
          .clientWidth;
        document.getElementById("red-road-col").style.width =
          (totalLong / this.totalTime) * this.timeRuned + "px";
        document.getElementById("white-ball-col").style.left =
          (totalLong / this.totalTime) * this.timeRuned + "px";
      }, 1000);
    }
  },

  beforeUpdate() {
    if (this.currentPlayUrl !== "") {
      if (this.totalTime - 1 < this.timeRuned) {
        clearInterval(this.timer);
        this.timeRuned = 0;
        document.getElementById("red-road-col").style.width = "0px";
        document.getElementById("white-ball-col").style.left = "0px";
      }
    }
  },

  methods: {
    getEvent(event) {
      // 定义事件对象标准化函数
      if (!event) {
        // 兼容IE浏览器
        event = window.event;
        event.target = event.srcElement;
        event.layerX = event.offsetX;
        event.layerY = event.offsetY;
      }
      event.mx = event.pageX || event.clientX + document.body.scrollLeft;
      // 计算鼠标指针的x轴距离
      event.my = event.pageY || event.clientY + document.body.scrollTop;
      // 计算鼠标指针的y轴距离
      return event; // 返回标准化的事件对象
    },
    mouseDown(e) {
      let event = this.getEvent(e);
      this.timeMovebegin = event.mx;
      this.currentWidth = document.getElementById("red-road-col").clientWidth;
      clearInterval(this.timer);
      document.addEventListener("mousemove", this.mouseMove, false);
      document.addEventListener("mouseup", this.mouseUp, false);
    },
    mouseMove(e) {
      let event = this.getEvent(e);
      const longest = document.getElementById("time-background").clientWidth;
      if (
        this.currentWidth + event.mx - this.timeMovebegin > -1 &&
        this.currentWidth + event.mx - this.timeMovebegin < longest
      ) {
        document.getElementById("red-road-col").style.width =
          this.currentWidth + event.mx - this.timeMovebegin + "px";
        document.getElementById("white-ball-col").style.left =
          this.currentWidth + event.mx - this.timeMovebegin + "px";
      }
    },
    mouseUp(e) {
      const event = this.getEvent(e);
      this.currentWidth = document.getElementById("red-road-col").clientWidth;
      // if (this.timeMoveDistance + event.mx - this.timeMovebegin < -1) {
      //   this.timeMoveDistance = 0;
      // }
      // if (this.timeMoveDistance + event.mx - this.timeMovebegin > longest) {
      //   this.timeMoveDistance = longest;
      // }
      // if (
      //   this.timeMoveDistance + event.mx - this.timeMovebegin >= 0 &&
      //   this.timeMoveDistance + event.mx - this.timeMovebegin < longest
      // ) {
      //   this.timeMoveDistance += event.mx - this.timeMovebegin;
      // }
      document.removeEventListener("mousemove", this.mouseMove, false);
      document.removeEventListener("mouseup", this.mouseUp, false);
    },
    play() {
      if (!this.$refs.audio) {
        return;
      }
      this.$refs.audio.play();
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.timeRuned += 1;
        const totalLong = document.getElementById("time-background")
          .clientWidth;
        document.getElementById("red-road-col").style.width =
          (totalLong / this.totalTime) * this.timeRuned + "px";
        document.getElementById("white-ball-col").style.left =
          (totalLong / this.totalTime) * this.timeRuned + "px";
      }, 1000);
      this.playStatus = true;
      this.pauseStatus = false;
    },
    pause() {
      this.$refs.audio.pause();
      clearInterval(this.timer);
      this.pauseStatus = true;
      this.playStatus = false;
    },
    getTime(time) {
      let time_m = parseInt(time / 60); //分
      let time_s = time % 60; //秒
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
    }
  }
};
</script>

<style lang="less">
#red-road-col {
  height: 4px;
  width: 0px;
  background: red;
  border-radius: 5px;
}
#white-ball-col {
  cursor: pointer;
  position: absolute;
  top: -4px;
  left: 0;
  height: 12px;
  width: 12px;
  border-radius: 5px;
  background: white;
  #red-ball {
    height: 4px;
    width: 4px;
    background: red;
    border-radius: 5px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 9;
  }
}
#music-player {
  font-size: 12px;
  color: white;
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  height: 50px;
  width: 100%;
  background-color: rgb(33, 33, 37);
  > div {
    display: flex;
    align-items: center;
  }
  .left-buttons {
    margin: 0px 27px;
    .previous {
      width: 28px;
      height: 28px;
      background-image: url("../../src/assets/playbar.png");
      background-position: 0 -130px;
      background-repeat: no-repeat;
    }
    .sourceLoading {
      width: 36px;
      height: 36px;
      margin: 0px 25px;
      background-image: url("../../src/assets/loading.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      animation: rotate 1s linear infinite;
    }
    .wait {
      width: 36px;
      height: 36px;
      margin: 0px 25px;
      background-image: url("../../src/assets/playbar.png");
      background-position: 0 -204px;
      background-repeat: no-repeat;
    }
    .play {
      width: 36px;
      height: 36px;
      margin: 0px 25px;
      background-image: url("../../src/assets/playbar.png");
      background-position: 0 -165px;
      background-repeat: no-repeat;
    }
    .next {
      width: 28px;
      height: 28px;
      background-image: url("../../src/assets/playbar.png");
      background-position: -80px -130px;
      background-repeat: no-repeat;
    }
  }
  .time-sound {
    flex: 1 1 auto;
    margin: 0px 6px;
    #time-background {
      flex: 1 1 auto;
      height: 4px;
      margin: 0px 11px;
      border-radius: 5px;
      position: relative;
      background-color: rgb(69, 69, 70);
    }
    .sound-icon {
      width: 25px;
      height: 25px;
      margin: 0px 4px 0px 9px;
      background-image: url("../../src/assets/playbar.png");
      background-position: -2px -248px;
      background-repeat: no-repeat;
    }
    .sound-background {
      height: 4px;
      width: 100px;
      border-radius: 5px;
      position: relative;
      background-color: rgb(23, 23, 25);
    }
  }
  .songs-control {
    display: flex;
    justify-content: space-between;
    width: 110px;
    margin: 0px 20px 0px 9px;
    .play-kind {
      width: 25px;
      height: 25px;
      background-image: url("../../src/assets/playbar.png");
      background-position: -3px -344px;
      background-repeat: no-repeat;
    }
    .hz {
      color: rgb(204, 103, 46);
      border: 1px solid rgb(204, 103, 46);
      padding: 1px 2px;
    }
    .song-list-icon {
      width: 25px;
      height: 25px;
      background-image: url("../../src/assets/playbar.png");
      background-position: -42px -68px;
      background-repeat: no-repeat;
    }
  }
}
</style>