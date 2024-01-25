<template>
  <el-aside :width="store.getCollapse ? '64px' : '200px'">
    <el-menu default-active="2" class="el-menu-vertical-demo" active-text-color="#ffd04b" background-color="transparent"
      text-color="#fff" :collapse-transition="false" :collapse="store.getCollapse">
      <h3>{{ store.getCollapse ? 'H' : '好去处' }}</h3>
      <el-menu-item @click="clickMenu(item.path)" v-for="item in noChildren" :key="item.name" :index="item.name">
        <el-icon>
          <component :is="item.icon"></component>
        </el-icon>
        <template #title>{{ item.label }}</template>
      </el-menu-item>
      <el-sub-menu v-for="item in hasChildren" :key="item.label" :index="item.label">
        <template #title>
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.label }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item @click="clickMenu(subItem.path)" v-for="subItem in item.children" :key="subItem.name"
            :index="subItem.name">{{ subItem.label }}</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-aside>
  <el-dialog v-model="showInfo" title="Tips" width="30%">
    <span>由于国家法律法规要求，请先完善信息。</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showInfo = false;">取消</el-button>
        <el-button type="primary" @click="showInfo = false; router.push('/user')">
          去完善
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
import { useStore } from "../store/index.js";
const store = useStore();
const showInfo = ref(false);
import { User } from '@/store/static.js';

const menuData = [
  {
    path: "/",
    name: "home",
    label: "首页",
    icon: "HomeFilled",
    isAdmin: false
  },
  {
    label: "寻去处",
    icon: "Place",
    isAdmin: false,
    children: [
      {
        path: "/request",
        name: "request",
        label: "发布",
        icon: "Filter",
      },
      {
        path: "/requestquery",
        name: "requestquery",
        label: "查询",
        icon: "Filter",
      },
    ],
  },
  {
    label: "欢迎来",
    icon: "Camera",
    isAdmin: false,
    children: [
      {
        path: "/welcome",
        name: "welcome",
        label: "发布",
        icon: "Filter",
      },
      {
        path: "/welcomequery",
        name: "welcomequery",
        label: "查询",
        icon: "Filter",
      }
    ],
  },
  {
    label: "数据",
    icon: "PieChart",
    isAdmin: true,
    children: [
      {
        path: "/queryuser",
        name: "queryuser",
        label: "用户",
        icon: "Filter",
      },
      {
        path: "/queryrequest",
        name: "queryrequest",
        label: "信息",
        icon: "Filter",
      },
      {
        path: "/queryprofit",
        name: "queryprofit",
        label: "利润",
        icon: "Filter",
      },
    ],
  },
];

const noChildren = computed(() => {
  const user = new User(JSON.parse(window.localStorage.getItem('user')));
  if (user && user.isAdmin) {
    return menuData.filter(item => !item.children)
  }
  else
    return menuData.filter(item => !item.children && !item.isAdmin)
})

const hasChildren = computed(() => {
  const user = new User(JSON.parse(window.localStorage.getItem('user')));
  if (user && user.isAdmin) {
    return menuData.filter(item => item.children)
  }
  else
    return menuData.filter(item => item.children && !item.isAdmin)
})

const clickMenu = (url) => {
  const user = new User(JSON.parse(window.localStorage.getItem('user')));
  const Login = user && user.name && user.identity && user.identityType && user.tel;
  if (!Login && url !== "/") {
    showInfo.value = true;
  }
  else
    router.push(url);
}

</script>

<style scoped>
.el-aside {
  background: url("../assets/aside.png");
}

.el-menu {
  height: 100vh;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}

.el-menu h3 {
  margin: 0;
  width: 100%;
  height: 60px;
  line-height: 50px;
  text-align: center;
  background-color: transparent;
  color: #fff;
}
</style>
