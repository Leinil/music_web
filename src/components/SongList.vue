<template>
  <div class="list-border">
    <el-row>
      <el-col
        v-for="item in column"
        :key="item.key"
        :span="item.col?item.col:defaultSpan"
        :class="item.hiddenText?'hiddenText list-title hover-color':'list-title hover-color'"
        @click.native="item.sort&&getSort(item.sort,item.key)"
      >
        <div style="width:95%">{{item.title}}</div>
        <i
          v-if="(item.sort&&currentSort!==item.key)||(item.sort&&sortStatus==='default')"
          class="el-icon-d-caret"
        ></i>
        <i v-if="item.sort&&sortStatus==='up'&&currentSort===item.key" class="el-icon-caret-top"></i>
        <i
          v-if="item.sort&&sortStatus==='down'&&currentSort===item.key"
          class="el-icon-caret-bottom"
        ></i>
      </el-col>
    </el-row>
    <el-row v-for="(song,index) in partData" :key="index" class="hover-color">
      <el-col
        v-for="item in column"
        :key="item.key"
        :span="item.col?item.col:defaultSpan"
        :class="index%2==0?'table-col':'table-col table-white-col'"
        :style="item.style?{...item.style}:''"
      >
        <span :title="item.render(song,index)" v-if="item.render">{{item.render(song,index)}}</span>
        <span :title="song[item.dataIndex]" v-else>{{song[item.dataIndex]}}</span>
      </el-col>
    </el-row>
    <!-- <div
      v-loading="lazyLoadloading"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgb(25, 27, 31)"
    ></div>-->
  </div>
</template>

<script>
/**
 * 关于loading的实现，还需要参考生命周期
 * 懒加载的时候由于用户可以自定义初次渲染数量可能不具备滑动条件。。。。
 * 由于该组件的展示相对于整个页面，在该组件的展示过程中，难免受到外部（上下两处的额外高度影响）所以加入了outSideHeightEffect的props参数
 */
import { Loading } from "element-ui";
export default {
  props: {
    data: {
      type: Array,
      required: true,
      default: function() {
        return [];
      }
    },
    column: {
      type: Array,
      required: true,
      default: function() {
        return [];
      }
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    lazyNum: {
      type: Number
    },
    relativeDom: {
      required: true
    },
    outSideClientHeight: {
      type: Number,
      default: 0
    },
    outSideOffsetHeight: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      // sortStatus控制排序的升序降序，默认是defalut一次只能控制一列的数据排序
      sortStatus: "default",
      // 开启懒加载，每次加载50个数据
      partData: [],
      partNum: 50,
      // 当前以什么排序
      currentSort: "",
      // 由于我自己的网站的特殊性（比较死板），关于scroll的滑动控制将以#content为基准
      contentDom: document.getElementById("content"),
      // lazyLoadloading: false,
      oneColHeight: 0
    };
  },
  watch: {
    outSideOffsetHeight: function(newHeight, oldHeight) {
      this.outSideOffsetHeight = newHeight;
      console.log(newHeight, "new");
      console.log(oldHeight, "old");
    }
  },
  mounted() {
    // console.log(this.contentDom.scrollHeight, "scrollHeight,全部");
    // console.log(this.contentDom.clientHeight, "clientHeight,元素本身");
    // console.log(this.contentDom.scrollTop, "scrollTop,滑块距离最顶部的距离");
    // console.log(document.documentElement.clientHeight,"页面的可视高度");
    if (this.lazyNum) {
      this.partData = this.data.slice(0, this.lazyNum);
      this.partNum = this.lazyNum;
    } else {
      this.partData = this.data.slice(0, this.partNum);
    }
    this.contentDom.addEventListener("scroll", this.handleScroll, true);
    // 当数据加载之后，获取单个歌曲的高度
    this.oneColHeight = [
      ...document.getElementsByClassName("el-row")
    ][0].clientHeight;
  },

  methods: {
    getSort(func, current) {
      this.currentSort = current;
      switch (this.sortStatus) {
        case "default":
          this.sortStatus = "down";
          this.partData.sort(func);
          break;
        case "down":
          this.sortStatus = "up";
          this.partData.reverse();
          break;
        case "up":
          this.sortStatus = "default";
          this.partData = this.data.slice(0, this.partNum);
          break;
        default:
          break;
      }
    },

    handleScroll() {
      const bottomOfContent =
        this.contentDom.scrollHeight ===
        this.contentDom.clientHeight + this.contentDom.scrollTop;
      console.log(this.contentDom.scrollHeight);
      console.log(this.contentDom.clientHeight);
      console.log(this.contentDom.scrollTop);
      if (bottomOfContent) {
        if (this.partData.length < this.data.length) {
          this.partNum += this.partNum;
          this.partData = this.data.slice(0, this.partNum);
        } else {
          this.contentDom.removeEventListener(
            "scroll",
            this.handleScroll,
            true
          );
        }
      }
    },

    // 类似无限滚动的下拉菜单
    handleScrollLevel2() {
      const windowClientHeight = document.documentElement.clientHeight;
      const scrollOffset = this.contentDom.scrollTop;
      // 当前屏幕可视区域可展示的总数
      const currentScreenCanShowColNum =
        (windowClientHeight - this.outSideClientHeight) / this.oneColHeight;
      // 在滑块之前可能已经展示了的总数
      let preShowNum =
        (scrollOffset - this.outSideOffsetHeight) / this.oneColHeight;
      // 10为自定义预估的上下额外渲染的dom，为了防止滑动过快
      preShowNum > 10 ? (preShowNum = preShowNum - 10) : (preShowNum = 0);
      console.log(preShowNum, "preShowNum");
      console.log(currentScreenCanShowColNum, "currentScreenCanShowColNum");
      this.partData = this.data.slice(
        preShowNum,
        currentScreenCanShowColNum + 10
      );
    }
  },

  beforeDestroy() {
    this.contentDom.removeEventListener("scroll", this.handleScroll, true);
  },

  computed: {
    defaultSpan: function() {
      return parseInt(24 / this.column.length);
    }
  }
};
</script>

<style lang="less" scoped>
.bottom-text {
  text-align: center;
}
#loading {
  width: 100%;
  height: 300px;
}
.list-border {
  text-align: left;
  color: #828385;
  font-size: 13px;
  .table-col {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    height: 30px;

    padding-left: 4px;
    line-height: 30px;
  }
  .list-title {
    display: flex;
    align-items: center;
    border-top: 1px solid rgb(130, 131, 133);
    border-bottom: 1px solid rgb(130, 131, 133);
    height: 30px;
    padding-left: 4px;
    line-height: 30px;
  }
  .list-title:not(:last-of-type) {
    border-right: 1px solid rgb(130, 131, 133);
  }
  .hiddenText {
    color: rgb(25, 27, 31);
  }
  .table-white-col {
    background: rgb(44, 46, 50);
  }
}

.hover-color:hover {
  cursor: pointer;
  background: rgb(35, 37, 41);
}
</style>