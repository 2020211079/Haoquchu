<template>
    <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <h3 style="margin: 0;">用户数据</h3>
      </div>
    </template>
    <el-table :data="table" height="500" stripe style="width: 90%; margin: 5px auto">
            <el-table-column prop="id" label="ID" width="60" />
            <el-table-column prop="username" label="用户名" width="180" />
            <el-table-column label="真实姓名" width="100">
                <template #default="scope">
                    <span v-if="scope.row.name">{{ scope.row.name[0] + '*'.repeat(scope.row.name.length-1) }}</span>
                    <span v-else>未完善</span>
                </template>
            </el-table-column>
            <el-table-column label="电话号码" width="140">
                <template #default="scope">
                    <span v-if="scope.row.tel">{{ scope.row.tel.substring(0,3) }}***{{ scope.row.tel.substring(7,11) }}</span>
                    <span v-else>未完善</span>
                </template>
            </el-table-column>
            <el-table-column label="VIP用户" width="100" :filters="[
                { text: '是', value: true },
                { text: '否', value: false },
            ]" :filter-method="filterTag" filter-placement="bottom-end">
                <template #default="scope">
                    <el-tag :type="scope.row.isVIP ? 'danger':''" disable-transitions>{{ scope.row.isVIP ? '是' : '否'
                    }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="city" label="所在地区" width="140" />
            <el-table-column prop="createTime" sortable label="创建时间" width="120">
                <template #default="scope">
                    {{ scope.row.createTime && scope.row.createTime.substr(0,10) }}
                </template>
            </el-table-column>
            <el-table-column prop="fixTime" sortable label="修改时间">
                <template #default="scope">
                    {{ scope.row.fixTime && scope.row.fixTime.substr(0,10) }}
                </template>
            </el-table-column>
        </el-table>
  </el-card>
</template>

<script setup>
import axios from 'axios';
import { User } from "@/store/static";
import { ref,onMounted } from 'vue';
const table = ref(null);

onMounted(() => {
    const id = JSON.parse(window.localStorage.getItem("user")).id;
    axios.get("http://localhost:3001/getusers", { params: {} }).then((res) => {
        if (res.data.status) {
            ElMessage.error("服务器错误，请重试");
        }
        else {
            table.value = res.data.msg.filter(item => new User(item));
        }
    }).catch((err) => {
        ElMessage.error("服务器错误，请重试");
    })
})

const filterTag = (value, row) => {
console.log(row.isVIP)
  return row.isVIP === value
}
</script>

<style scoped>
.box-card {
  height: 99%;
  background-color: #ffffffaa;
}
</style>