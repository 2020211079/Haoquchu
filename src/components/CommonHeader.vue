<template>
    <el-header class="common-header">
        <div class="l-content">
            <el-button size="small" @click="store.setCollapse">
                <el-icon size="small">
                    <Menu />
                </el-icon>
            </el-button>
        </div>
        <div class="r-content">
            <el-dropdown>
                <span class="el-dropdown-link">
                    <img class="user" :src="avatar">
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="clickMenu">个人中心</el-dropdown-item>
                        <el-dropdown-item @click="showLogOut = true">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </el-header>
    <el-dialog
    v-model="showLogOut"
    title="登出"
    width="30%"
  >
    <span>确定登出吗？还要重进哦。</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showLogOut = false">取消</el-button>
        <el-button type="primary" @click="logOut">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref,computed,onMounted} from 'vue';
import { useRouter } from "vue-router";
const router = useRouter();
import { useStore } from "../store/index.js";
const store = useStore();
const showLogOut = ref(false);
const avatar = computed(() => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    return store.getAvatar && user ? require(`../assets/user/${user.id}/${store.getAvatar}`) : require('../assets/default.png')
})

const clickMenu = () => {
    router.push("/user");
}
const logOut = ()=>{
    window.localStorage.setItem("user","");
    router.push("/login");
}

onMounted(()=>{
    const user = JSON.parse(window.localStorage.getItem("user"));
    store.setAvatar(user.avatar);
})
</script>

<style scoped>
:focus-visible {
    outline: none;
}

.common-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: url("../assets/header.png");
}

.user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.r-content {
    flex-wrap: wrap;
}
</style>