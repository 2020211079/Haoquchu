import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/Main.vue'), //首页
    redirect: 'home',
    children: [
      {
        path: 'home',
        component: () => import('../views/Home.vue'), //主页面
      },
      {
        path: 'user',
        component: () => import('../views/User.vue') //用户修改
      },
      {
        path: 'request',
        component: () => import('../views/request/Request.vue') //寻去处
      },
      {
        path: 'requestquery',
        component: () => import('../views/request/RequestQuery.vue') //寻去处查询
      },
      {
        path: 'welcome',
        component: () => import('../views/welcome/Welcome.vue') //欢迎来
      },
      {
        path: 'welcomequery',
        component: () => import('../views/welcome/WelcomeQuery.vue') //欢迎来
      },
      {
        path: 'queryuser',
        component: () => import('../views/query/QueryUser.vue') //查询用户
      },
      {
        path: 'queryrequest',
        component: () => import('../views/query/QueryRequest.vue') //查询信息
      },
      {
        path: 'queryprofit',
        component: () => import('../views/query/QueryProfit.vue') //查询利润
      },
    ]
  },
  {
    path: '/login',
    component: () => import('../views/Login.vue'), //登录
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
