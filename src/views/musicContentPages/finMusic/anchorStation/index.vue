<template>
  <div class="dj_border">
    <!-- 电台主播轮播图展示 -->
    <div class="dj_banner">
      <el-carousel :interval="40000" type="card" height="200px">
        <el-carousel-item v-for="(item,index) in djBanner" :key="index">
          <img :src="item.pic" class="dj_banner_img" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 电台分类展示 -->
    <div class="dj_type">
      <el-carousel :interval="40000" height="90px" indicator-position="none" :loop="false">
        <el-carousel-item v-for="(item,index) in djType" :key="index" class="dj_type_border">
          <div v-for="(typeItem,typeIndex ) in item" :key="typeIndex">
            <div class="dj_card">
              <div
                class="dj_type_img"
                v-bind:style="{'backgroundImage':`url(${typeItem.picUWPUrl})`,'color':'red'}"
              ></div>
              <span>{{typeItem.name}}</span>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 分类展示的前三个 -->
    <div v-for="(name,index) in djTopThreeName" :key="index">
      <div class="title">
        <span>{{name}}</span>
      </div>
      <div class="dj_detail_list">
        <div
          class="dj_detail_item"
          v-for="(detail,index) in djTopThreeDetail[index].slice(0,6)"
          :key="index"
        >
          <img :src="detail.picUrl" alt="">
          <div class="dj_detail_desc">{{detail.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      djBanner: [],
      djType: [],
      djTopThreeDetail: [[], [], []],
      djTopThreeName: [],
    };
  },
  mounted() {
    //电台轮播
    this.$axios.get("/dj/banner").then((res) => {
      this.djBanner = res.data;
    });
    // 电台分类
    this.$axios.get("/dj/catelist").then((res) => {
      const { categories = [] } = res;
      const typeSplice = [];
      for (let i = 0; i < categories.length; i++) {
        typeSplice.push(categories.slice(i, i + 10));
        i += 10;
      }
      this.djType = typeSplice;
      // 拿到分类列表之后 取前三个来展示
      const topTree = categories.slice(0, 3);
      // 拿名字
      const tempArrName = [];
      // 拿电台数组
      const tempArrDetail=[];
      const tempArrrDetailAsync = topTree.map((type) => {
        tempArrName.push(type.name);
        return this.$axios.get(`/dj/recommend/type?type=${type.id}`);
      });
      Promise.all(tempArrrDetailAsync).then((res) => {
        res.map(list=>{
          tempArrDetail.push(list.djRadios)
        })
        this.djTopThreeDetail=tempArrDetail;
      });
      this.djTopThreeName = tempArrName;
    });
  },
};
</script>
<style lang="less" scoped>
@import "./index.less";
</style>