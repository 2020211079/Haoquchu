<template>
  <el-container>
    <common-aside />
    <el-container class="lay-container">
      <common-header />
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import CommonAside from "../components/CommonAside.vue"
import CommonHeader from "../components/CommonHeader.vue"
</script>

<style scoped>
.lay-container {
  flex-direction: column;
  background: url("../assets/main.jpg");
  background-position: -400px -200px;
}
</style>