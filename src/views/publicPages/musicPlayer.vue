<template>
  <div id="music-player">
    <div v-if="currentPlayDetail.name" id="musicDetail">
      <MusicDetail :musicDetail="currentPlayDetail" />
    </div>
    <div class="left-buttons">
      <div class="previous" @click="playPre"></div>
      <div class="wait" v-if="!loading&&pauseStatus" @click="play"></div>
      <div class="play" v-if="!loading&&currentPlayUrl!==''&&playStatus" @click="pause"></div>
      <div class="sourceLoading" v-if="loading"></div>
      <div class="next" @click="playNext"></div>
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
      <!-- 为了简便音量显示为100px -->
      <div class="sound-background">
        <div id="red-road-voice"></div>
        <div id="white-ball-voice">
          <div id="red-ball-voice"></div>
        </div>
      </div>
    </div>
    <div class="songs-control">
      <div class="play-kind"></div>
      <div class="hz">极高</div>
      <el-popover placement="bottom" width="500" trigger="click" :offset="12">
        <div class="song-border">
          <p class="song-list-title">播放列表</p>
          <el-row
            v-for="(item,index) in musicSourceList"
            :key="index"
            :class="index%2==0?'song-list-item':'song-list-item table-white-col'"
            type="flex"
            justify="space-between"
          >
            <el-col :span="1" class="song-list-col">
              <div v-if="item.id===currentPlayDetail.id" class="playing-icon"></div>
            </el-col>
            <el-col :span="12" class="song-list-col" :title="item.name">{{item.name}}</el-col>
            <el-col
              :span="5"
              class="song-list-col"
              :title="getSongerName(item.ar)"
            >{{getSongerName(item.ar)}}</el-col>
            <el-col :span="4" class="song-list-col time-show">{{getTimeBystring(item.dt)}}</el-col>
          </el-row>
        </div>
        <div class="song-list-icon" slot="reference"></div>
      </el-popover>
    </div>
    <audio ref="audio" :src="currentPlayUrl" autoplay="autoplay"></audio>
  </div>
</template>

<script>
import playerIcon from "@/assets/playbar.png";
import MusicDetail from "@/components/MusicDetail.vue";
export default {
  components: {
    MusicDetail
  },
  data() {
    return {
      timeRuned: 0,
      totalTime: 0,
      timer: null,
      pauseStatus: true,
      playStatus: false,
      timeMovebegin: 0,
      voiceShowBegin: sessionStorage.getItem("voice") * 100 || 1,
      voiceMovebegin: 0,
      currentWidth: 0
    };
  },

  mounted() {
    this.$refs.audio.pause();
    const whiteBall = document.getElementById("white-ball-col");
    const whiteBallVoice = document.getElementById("white-ball-voice");
    const redRoadVoice = document.getElementById("red-road-voice");
    whiteBall.addEventListener("mousedown", this.mouseDown, false);
    whiteBallVoice.addEventListener("mousedown", this.mouseDownVoice, false);
    this.$refs.audio.onended = this.playNext;
    this.$refs.audio.volume = sessionStorage.getItem("voice")
      ? sessionStorage.getItem("voice")
      : 0.1;
    whiteBallVoice.style.left = this.voiceShowBegin + "px";
    redRoadVoice.style.width = this.voiceShowBegin + "px";
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
      return this.$store.state.currentPlayingMusicDetail;
    }
  },

  watch: {
    currentPlayUrl: function(newUrl, oldUrl) {
      if (!this.$store.state.currentPlayingMusicUrl) {
        const { name } = this.currentPlayDetail;
        this.$notify({
          title: `《${name}》资源获取失败`,
          message: `因版权或当前权限问题无法播放`,
          type: "warning"
        });
        this.pause();
      }
      this.timeRuned = 0;
      this.playStatus = true;
      this.pauseStatus = false;
    },
    currentPlayDetail: function(newObj, oldObj) {
      if (!this.currentPlayUrl) {
        return;
      }
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
    if (this.currentPlayUrl !== "" && this.playStatus) {
      if (this.totalTime - 1 < this.timeRuned) {
        clearInterval(this.timer);
        this.timeRuned = 0;
        document.getElementById("red-road-col").style.width = "0px";
        document.getElementById("white-ball-col").style.left = "0px";
      }
    }
  },

  beforeDestroy() {
    clearInterval(this.timer);
    this.$store.commit({
      type: "changeCurrentUrl",
      payload: ""
    });
  },

  methods: {
    playNext() {
      const songsList = this.$store.state.idsList;
      if (songsList.length === 0) {
        this.totalTime = 0;
        return;
      }
      const index = songsList.indexOf(this.currentPlayDetail.id);
      let nextId = "";
      if (index === songsList.length - 1) {
        nextId = songsList[0];
      } else {
        nextId = songsList[index + 1];
      }
      this.$store.commit({
        type: "changeSourceLoading",
        payload: true
      });
      this.$store.dispatch({
        type: "getMusicUrl",
        id: nextId,
        noUrlCallback: this.noUrl
      });
    },
    noUrl() {
      this.$notify({
        title: "资源获取失败",
        message: "因版权或VIP问题无法获取资源~~",
        type: "warning"
      });
    },
    playPre() {
      const songsList = this.$store.state.idsList;
      if (songsList.length === 0) {
        this.totalTime = 0;
        return;
      }
      const index = songsList.indexOf(this.currentPlayDetail.id);
      let preId = "";
      if (index === 0) {
        preId = songsList[songsList.length - 1];
      } else {
        preId = songsList[index - 1];
      }
      this.$store.commit({
        type: "changeSourceLoading",
        payload: true
      });
      this.$store.dispatch({
        type: "getMusicUrl",
        id: preId,
        noUrlCallback: this.noUrl
      });
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
    getTimeBystring(time) {
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

    // 时间控制
    mouseDown(e) {
      if (this.currentPlayUrl === "") {
        return;
      }
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
        const musicTimeOff = parseInt(
          ((this.currentWidth + event.mx - this.timeMovebegin) / longest) *
            parseInt(this.$refs.audio.duration)
        );
        this.timeRuned = musicTimeOff;
        document.getElementById("red-road-col").style.width =
          this.currentWidth + event.mx - this.timeMovebegin + "px";
        document.getElementById("white-ball-col").style.left =
          this.currentWidth + event.mx - this.timeMovebegin + "px";
      }
    },
    mouseUp(e) {
      const event = this.getEvent(e);
      this.currentWidth = document.getElementById("red-road-col").clientWidth;
      const longest = document.getElementById("time-background").clientWidth;
      const musicTimeOff =
        (this.currentWidth / longest) * parseInt(this.$refs.audio.duration);
      this.$refs.audio.currentTime = musicTimeOff;
      this.timer = setInterval(() => {
        this.timeRuned += 1;
        const totalLong = document.getElementById("time-background")
          .clientWidth;
        document.getElementById("red-road-col").style.width =
          (totalLong / this.totalTime) * this.timeRuned + "px";
        document.getElementById("white-ball-col").style.left =
          (totalLong / this.totalTime) * this.timeRuned + "px";
      }, 1000);
      document.removeEventListener("mousemove", this.mouseMove, false);
      document.removeEventListener("mouseup", this.mouseUp, false);
    },
    // 音量控制
    mouseDownVoice(e) {
      let event = this.getEvent(e);
      this.voiceMovebegin = event.mx;
      document.addEventListener("mousemove", this.mouseMoveVoice, false);
      document.addEventListener("mouseup", this.mouseUpVoice, false);
    },
    mouseMoveVoice(e) {
      let event = this.getEvent(e);
      if (
        this.voiceShowBegin + event.mx - this.voiceMovebegin > -1 &&
        this.voiceShowBegin + event.mx - this.voiceMovebegin < 100
      ) {
        document.getElementById("red-road-voice").style.width =
          this.voiceShowBegin + event.mx - this.voiceMovebegin + "px";
        document.getElementById("white-ball-voice").style.left =
          this.voiceShowBegin + event.mx - this.voiceMovebegin + "px";
        this.$refs.audio.volume =
          (this.voiceShowBegin + event.mx - this.voiceMovebegin) / 100;
      }
    },
    mouseUpVoice(e) {
      let event = this.getEvent(e);
      this.voiceShowBegin += event.mx - this.voiceMovebegin;
      document.removeEventListener("mousemove", this.mouseMoveVoice, false);
      document.removeEventListener("mouseup", this.mouseUpVoice, false);
      sessionStorage.setItem(
        "voice",
        document.getElementById("red-road-voice").clientWidth / 100
      );
    },

    play() {
      if (!this.$refs.audio || this.currentPlayUrl === "") {
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

<style lang="less" scoped>
#musicDetail {
  position: absolute;
  left: 0;
  top: -55px;
  height: 50px;
  width: 200px;
}
.playing-icon {
  width: 100%;
  height: 100%;
  background-image: url("../../../src/assets/pause.png");
  background-position: 100% 100%;
  background-repeat: no-repeat;
}
.table-white-col {
  background: rgb(44, 46, 50);
}
.time-show {
  padding-left: 35px;
}
.song-border {
  max-height: 660px;
  overflow: auto;
}
.time-right {
  text-align: right;
}
.song-list-title {
  color: white;
  font-size: 10px;
  text-align: center;
}
.song-list-col {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.song-list-item {
  color: white;
  font-size: 10px;
  padding: 5px 0px;
}
#red-road-voice {
  height: 4px;
  width: 0px;
  background: red;
  border-radius: 5px;
}
#white-ball-voice {
  cursor: pointer;
  position: absolute;
  top: -4px;
  left: 0;
  height: 12px;
  width: 12px;
  border-radius: 5px;
  background: white;
  #red-ball-voice {
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
  z-index: 10;
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
      background-image: url("../../../src/assets/playbar.png");
      background-position: 0 -130px;
      background-repeat: no-repeat;
    }
    .sourceLoading {
      width: 36px;
      height: 36px;
      margin: 0px 25px;
      background-image: url("../../../src/assets/loading.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      animation: rotate 1s linear infinite;
    }
    .wait {
      width: 36px;
      height: 36px;
      margin: 0px 25px;
      background-image: url("../../../src/assets/playbar.png");
      background-position: 0 -204px;
      background-repeat: no-repeat;
    }
    .play {
      width: 36px;
      height: 36px;
      margin: 0px 25px;
      background-image: url("../../../src/assets/playbar.png");
      background-position: 0 -165px;
      background-repeat: no-repeat;
    }
    .next {
      width: 28px;
      height: 28px;
      background-image: url("../../../src/assets/playbar.png");
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
      background-image: url("../../../src/assets/playbar.png");
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
      background-image: url("../../../src/assets/playbar.png");
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
      background-image: url("../../../src/assets/playbar.png");
      background-position: -42px -68px;
      background-repeat: no-repeat;
    }
  }
}
</style>