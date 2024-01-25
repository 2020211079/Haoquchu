<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <h3 style="margin: 0;">请求数据</h3>
            </div>
        </template>
        <el-table :data="isWelcome ? welcomeTable : requestTable" :height="460" stripe style="width: 100%; margin-top:5px;">
            <el-table-column prop="username" label="发起人" width="160" />
            <el-table-column prop="createTime" sortable label="发送时间" width="120">
                <template #default="scope">
                    {{ scope.row.createTime.substring(0,10) }}
                </template>
            </el-table-column>
            <el-table-column prop="fixTime" sortable label="修改时间" width="120">
                <template #default="scope">
                    {{ scope.row.fixTime.substring(0,10) }}
                </template>
            </el-table-column>
            <el-table-column prop="endTime" sortable label="截止时间" width="120">
                <template #default="scope">
                    {{ !isWelcome && scope.row.endTime ? scope.row.endTime.substring(0,10) : "无" }}
                </template>
            </el-table-column>
            <el-table-column label="请求状态" width="100" :filters="[
                    { text: '已接受', value: '已完成' },
                    { text: '已完成', value: '已完成' },
                    { text: '进行中', value: '进行中' },
                    { text: '已拒绝', value: '已取消' },
                    { text: '已取消', value: '已取消' },
                    { text: '已过期', value: '已过期' },
                    { text: '已失效', value: '已过期' },
                ]">
                <template #default="scope">
                    <el-tag :type="getTag(scope.row.state)" disable-transitions>{{ scope.row.state
                    }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column v-if="!isWelcome" label="最高单价" width="110">
                <template #default="scope">
                    ￥{{ scope.row.fee }}.00
                </template>
            </el-table-column>
            <el-table-column>
                <template #header>
                    <el-switch v-model="isWelcome" active-text="欢迎来" inactive-text="寻去处" />
                </template>
                <template #default="scope">
                    <el-button size="small" @click="showUser = scope.row">查看用户信息</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <el-dialog v-model="showUser" title="用户详细信息" width="75%">
    <el-descriptions class="margin-top" :title="showUser.username" :column="3" :size="size" border>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <user />
            </el-icon>
            用户名
          </div>
        </template>
        {{ showUser.username }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <iphone />
            </el-icon>
            电话
          </div>
        </template>
        {{ showUser.tel }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <location />
            </el-icon>
            城市
          </div>
        </template>
        {{ showUser.city }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <tickets />
            </el-icon>
            创建时间
          </div>
        </template>
        {{ showUser ? showUser.createTime.substring(0,10) : ''}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <office-building />
            </el-icon>
            简介
          </div>
        </template>
        {{ showUser.memo }}
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

//#region 表格和控制切换的部分
const requestTable = ref(null);
const welcomeTable = ref(null);
const isWelcome = ref(false);
const getTag = (state) => {
    switch (state) {
        case "已完成":
            return "success";
        case "进行中":
            return "";
        case "已取消":
            return "danger";
        case "已过期":
            return "info";
        default:
            return;
    }
}
//#endregion

//#region 显示用户信息
const showUser = ref(false);
//#endregion

//#region onMounted
onMounted(() => {
    axios.get("http://localhost:3001/getrequest").then((res) => {
        if (res.data.status) {
            ElMessage.error("服务器错误，请重试");
        }
        else {
            requestTable.value = res.data.msg;
        }
    }).catch((err) => {
        ElMessage.error("服务器错误，请重试");
    })
    axios.get("http://localhost:3001/getwelcome").then((res) => {
        if (res.data.status) {
            ElMessage.error("服务器错误，请重试");
        }
        else {
            welcomeTable.value = res.data.msg;
        }
    }).catch((err) => {
        ElMessage.error("服务器错误，请重试");
    })
})
//#endregion
</script>

<style scoped>
.box-card {
    height: 99%;
    background-color: #ffffffaa;
}
</style>