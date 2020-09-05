<template>
  <div class="singer_content_border">
    <div class="list">
      <div class="left">语种：</div>
      <div class="songer_page_selectTypeList_right">
        <div v-for="(lang,index) in languages" :key="index">
          <div class="button_border" :id="lang+'0'">{{lang}}</div>
          <span v-if="index<languages.length-1">|</span>
          <span v-else></span>
        </div>
      </div>
    </div>
    <div class="list">
      <div class="left">分类：</div>
      <div class="songer_page_selectTypeList_right">
        <div v-for="(kind,index) in classification" :key="index">
          <div class="button_border" :id="kind+'1'">{{kind}}</div>
          <span v-if="index<classification.length-1">|</span>
          <span v-else></span>
        </div>
      </div>
    </div>
    <div class="list">
      <div class="left">筛选：</div>
      <div class="songer_page_selectTypeList_right">
        <div v-for="(word,index) in screen" :key="index">
          <div class="button_border" :id="word+'2'">{{word}}</div>
          <span v-if="index<screen.length-1">|</span>
          <span v-else></span>
        </div>
      </div>
    </div>
    <div class="show_singer">
      <div v-for="(singer,index) in songerList" :key="index" class="singer_border">
        <img :src="singer.img1v1Url" alt />
        <span>{{singer.name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      languages: ["全部", "华语", "欧美", "日本", "韩国", "其他"],
      classification: ["全部", "男歌手", "女歌手", "乐队组合"],
      screen: ["热门"],
      selectedTags: {
        0: "",
        1: "",
        2: "",
      },
      selectParams: {
        type: "",
        area: "",
        initial: "",
      },
      songerList: [],
    };
  },
  mounted() {
    this.getSongerList(-1,-1,-1)
    const typeTransObj = {
      全部: -1,
      男歌手: 1,
      女歌手: 2,
      乐队: 3,
    };
    const areaTransObj = {
      全部: -1,
      华语: 7,
      欧美: 96,
      日本: 8,
      韩国: 16,
      其他: 0,
    };
    // 处理 《筛选》数组
    for (let i = 0; i < 26; i++) {
      this.screen.push(String.fromCharCode(65 + i));
    }
    this.screen.push("#");
    const context = this;
    // 处理一下三行选中结果
    // 思路：这个地方拿到了class list并添加了事件监听。后续在data中 存储一个行数加mei行内选中的标识
    // 点击事件触发是根据标识来判断每行是否移除或添加active class
    const itemsPart = document.getElementsByClassName(
      "songer_page_selectTypeList_right"
    );
    const itemsArray = Array.prototype.slice.call(itemsPart, 0);
    itemsArray.forEach((element, colIndex) => {
      element.addEventListener("click", function (e) {
        // 处理页面样式
        const obj = {};
        const event = e || window.event;
        var target = event.target || event.srcElement || obj;
        // 点击到了正确的位置
        if (target.className === "button_border") {
          // 如果保存的标识和本次点击的位置不一样
          if (context.$data.selectedTags[colIndex] != target.id) {
            if (context.$data.selectedTags[colIndex] !== "") {
              // 需要去除之前的active标识
              document
                .getElementById(context.$data.selectedTags[colIndex])
                .classList.remove("active");
            }
            // 新选的dom添加active，并更新标识
            document.getElementById(target.id).classList.add("active");
            context.$data.selectedTags[colIndex] = target.id;
          }
        }
        // 处理接口调用
        colIndex === 0
          ? (context.$data.selectParams.area = areaTransObj[target.innerText])
          : "";
        colIndex === 1
          ? (context.$data.selectParams.type = typeTransObj[target.innerText])
          : "";
        if (colIndex === 2) {
          target.innerText === "热门"
            ? (context.$data.selectParams.initial = -1)
            : "";
          target.innerText === "#"
            ? (context.$data.selectParams.initial = 0)
            : "";
          target.innerText !== "#" && target.innerText !== "热门"
            ? (context.$data.selectParams.initial = target.innerText.toLocaleLowerCase())
            : "";
        }
        const { type, area, initial } = context.$data.selectParams;
        context.getSongerList(type, area, initial);
      });
    });
  },
  methods: {
    getSongerList(type, area, initial) {
      let url = "/artist/list?";
      type !== "" ? (url += `&type=${type}`) : url;
      area !== "" ? (url += `&area=${area}`) : url;
      initial !== "" ? (url += `&initial=${initial}`) : url;
      this.$axios.get(url).then((res) => {
        console.log(res.artists) 
        this.songerList = res.artists;
      });
    },
  },
};
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>