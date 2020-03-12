<template>
  <div id="app">
    <Home />
  </div>
</template>

<script>
import Home from "@/views/Home.vue";
export default {
  name: "app",
  components: {
    Home
  }
};
</script>

<style scope>
html,
body {
  margin: 0;
  height: 100%;
  min-width: 1024px;
  overflow: hidden;
  background: rgb(25, 27, 31);
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

/* 控制滚动条样式 */
::-webkit-scrollbar {
  width: 10px;
  height: 8px;
  background-color: rgb(25, 27, 31);
  -webkit-transition: background-color 0.3s ease-in-out;
  transition: background-color 0.3s ease-in-out;
}
::-webkit-scrollbar-thumb {
  background-color: rgb(44, 46, 50);
  height: 10px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -webkit-transition: background-color 0.3s ease-in-out;
  transition: background-color 0.3s ease-in-out;
}
::-webkit-scrollbar-thumb :hover {
  background-color: rgb(56, 58, 61);
}
</style>
