<template>
  <div class="list-border" id="list">
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
    <div id="preSongs"></div>
    <el-row
      v-for="(song,index) in partData"
      :key="index"
      class="hover-color"
      @click.native="colClick&&_colClick(colClick,song)"
    >
      <el-col
        v-for="item in column"
        :key="item.key"
        :span="item.col?item.col:defaultSpan"
        :class="index%2==0?'table-col':'table-col table-white-col'"
        :style="item.style?{...item.style}:''"
      >
        <span
          :title="item.render(song,index,preExit)"
          v-if="item.render"
        >{{item.render(song,index,preExit)}}</span>
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
import _ from "lodash";
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
      // 用户自定义懒加载数据
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
    },
    colClick: {
      type: Function
    }
  },

  data() {
    return {
      // sortStatus控制排序的升序降序，默认是defalut一次只能控制一列的数据排序
      sortStatus: "default",
      // 开启懒加载，每次加载50个数据
      partData: [],
      partNum: 50,
      // 当前以什么字段排序
      currentSort: "",
      // 一般情况下是基于body，但由于我自己的网站的特殊性需要设置相对滑动的dom
      contentDom: this.relativeDom,
      // lazyLoadloading: false,
      oneColHeight: 0,
      preExit: 0,
      // 保存一份父组件数据
      c_data: _.cloneDeep(this.data)
    };
  },
  watch: {
    outSideOffsetHeight: function(newHeight, oldHeight) {
      this.outSideOffsetHeight = newHeight;
    }
  },
  mounted() {
    if (this.lazyNum) {
      this.partData = this.c_data.slice(0, this.lazyNum);
      this.partNum = this.lazyNum;
    } else {
      this.partData = this.c_data.slice(0, this.partNum);
    }
    if (this.c_data.length > 150) {
      this.contentDom.addEventListener("scroll", this.handleScrollLevel2, true);
    } else {
      this.contentDom.addEventListener("scroll", this.handleScroll, true);
    }
    // 当数据加载之后，获取单个歌曲的高度
    this.oneColHeight = [
      ...document.getElementsByClassName("el-row")
    ][0].clientHeight;
  },

  methods: {
    _colClick(func, record) {
      func(record);
    },
    // 单纯的排序
    getSort(func, current) {
      this.currentSort = current;
      switch (this.sortStatus) {
        case "default":
          this.sortStatus = "down";
          this.c_data.sort(func);
          break;
        case "down":
          this.sortStatus = "up";
          this.c_data.reverse();
          break;
        case "up":
          this.sortStatus = "default";
          this.c_data = _.cloneDeep(this.data);
          break;
        default:
          break;
      }
      this.partData = this.c_data.slice(0, this.partNum);
    },

    // 重新渲染时的排序
    getSortWhenRender(func) {
      switch (this.sortStatus) {
        case "down":
          this.c_data.sort(func);
          break;
        case "up":
          this.c_data.reverse();
          break;
        case "default":
          this.c_data = this.data;
          break;
        default:
          break;
      }
    },

    handleScroll() {
      // 获取的值不一定是精确的整数值
      const bottomOfContent =
        this.contentDom.scrollHeight - 1 <
        this.contentDom.clientHeight + this.contentDom.scrollTop;
      if (bottomOfContent) {
        if (this.partData.length < this.c_data.length) {
          this.partNum += this.partNum;
          this.partData = this.c_data.slice(0, this.partNum);
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
      // for (let col = 0; col < this.column.length; col++) {
      //   // 命中currentSort的话同时代表了有sort方法
      //   if (this.column[col].key === this.currentSort) {
      //     this.getSortWhenRender(this.column[col].sort);
      //     break;
      //   }
      // }
      const windowClientHeight = document.documentElement.clientHeight;
      const scrollOffset = this.contentDom.scrollTop;
      // 当前屏幕可视区域可展示的总数
      const currentScreenCanShowColNum = parseInt(
        (windowClientHeight - this.outSideClientHeight) / this.oneColHeight
      );

      // 在滑块之前可能已经展示了的总数
      let preShowNum = parseInt(
        (scrollOffset - this.outSideOffsetHeight - 50) / this.oneColHeight
      );
      preShowNum < 2 ? (preShowNum = 0) : preShowNum;
      this.preExit = preShowNum;
      if (preShowNum + currentScreenCanShowColNum < this.c_data.length) {
        // width设置为负数时会失效
        document.getElementById("list").style.height =
          windowClientHeight + preShowNum * this.oneColHeight + "px";
        document.getElementById("preSongs").style.height =
          preShowNum * this.oneColHeight + "px";
        document.getElementById("preSongs").style.marginTop = "0px";
        this.partData = this.c_data.slice(
          preShowNum,
          preShowNum + currentScreenCanShowColNum + 2
        );
      } else {
        document.getElementById("preSongs").style.marginTop =
          this.outSideClientHeight + "px";
        this.partData = this.c_data.slice(
          this.c_data.length - currentScreenCanShowColNum,
          this.c_data.length
        );
        this.preExit = parseInt(
          document.getElementById("preSongs").clientHeight / this.oneColHeight
        );
      }
    }
  },

  beforeDestroy() {
    if (this.c_data.length > 150) {
      this.contentDom.removeEventListener(
        "scroll",
        this.handleScrollLevel2,
        true
      );
    } else {
      this.contentDom.removeEventListener("scroll", this.handleScroll, true);
    }
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