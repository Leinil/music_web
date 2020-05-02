<template>
  <div id="music-player">
    <div class="left-buttons">
      <div class="previous"></div>
      <div class="play"></div>
      <div class="next"></div>
    </div>
    <div class="time-sound">
      <div>01:54</div>
      <div class="time-background"></div>
      <div>03:23</div>
      <div class="sound-icon"></div>
      <div class="sound-background"></div>
    </div>
    <div class="songs-control">
      <div class="play-kind"></div>
      <div class="hz">极高</div>
      <div class="song-list-icon"></div>
    </div>
  </div>
</template>

<script>
import playerIcon from "@/assets/playbar.png";
export default {};
</script>

<style lang="less">
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
    .play {
      width: 36px;
      height: 36px;
      margin: 0px 25px;
      background-image: url("../../src/assets/playbar.png");
      background-position: 0 -204px;
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
    .time-background {
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
    margin:0px 20px 0px 9px;
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