<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <h3 style="margin: 0;">查询欢迎来信息</h3>
            </div>
        </template>
        <div ref="eltable">
            <el-table :data="table" :height="460" stripe style="width: 100%; margin-top:5px;">
                <el-table-column label="标题" width="200">
                    <template #default="scope">
                        <abbr v-if="scope.row.title.length > 10" :title="scope.row.title" style="text-decoration: none;">{{
                            scope.row.title.substring(0, 10) }}……</abbr>
                        <span v-else>{{ scope.row.title }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" sortable label="请求时间" width="120">
                    <template #default="scope">
                        {{ scope.row.createTime.substring(0,10) }}
                    </template>
                </el-table-column>
                <el-table-column prop="fixTime" sortable label="最后修改时间" width="140">
                    <template #default="scope">
                        {{ scope.row.fixTime.substring(0,10) }}
                    </template>
                </el-table-column>
                <el-table-column label="请求状态" width="100" :filters="[
                    { text: '已接受', value: '已接受' },
                    { text: '进行中', value: '进行中' },
                    { text: '已拒绝', value: '已拒绝' },
                    { text: '已取消', value: '已取消' },
                ]" :filter-method="filterTag" filter-placement="bottom-end">
                    <template #default="scope">
                        <el-tag :type="getTag(scope.row.state)" disable-transitions>{{ scope.row.state
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="发布费用" width="110">
                    <template #default="scope">
                        {{ scope.row.state === "已接受" ? "￥2.00" : "---" }}
                    </template>
                </el-table-column>
                <el-table-column label="响应费用" width="110">
                    <template #default="scope">
                        {{ scope.row.state === "已接受" ? "￥2.00" : "---" }}
                    </template>
                </el-table-column>
                <el-table-column label="内容管理">
                    <template #default="scope">
                        <el-button size="small" @click="showDetail = scope.row">查看内容</el-button>
                        <el-button size="small" :disabled="scope.row.state !== '进行中'">修改</el-button>
                        <el-button size="small" type="danger" @click="endRequest(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-pagination class="page" background layout="prev, pager, next" :total="table ? table.length : 10"
            v-model:current-page="currentPage" @current-change="changeTop" />
    </el-card>
    <el-dialog v-model="showDetail" title="寻去处详细信息">
        <el-descriptions :title="showDetail.title" :column="3" border>
            <el-descriptions-item>
                <template #label>
                    <div>
                        <el-icon>
                            <Picture />
                        </el-icon>
                        图片信息1
                    </div>
                </template>
                kooriookami
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div>
                        <el-icon>
                            <Picture />
                        </el-icon>
                        图片信息2
                    </div>
                </template>
                18100000000
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div>
                        <el-icon>
                            <VideoPlay />
                        </el-icon>
                        视频信息
                    </div>
                </template>
                Suzhou
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div>
                        <el-icon>
                            <tickets />
                        </el-icon>
                        介绍
                    </div>
                </template>
                {{ showDetail.detail }}
            </el-descriptions-item>
        </el-descriptions>
    </el-dialog>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from 'vue';
import { Welcome } from '@/store/static.js';
import { ElMessage } from 'element-plus';
const showDetail = ref(false);
const showWelcome = ref(true);
const currentPage = ref(1);
const table = ref(null);
const welcomeTable = ref(null);

const getTag = (state) => {
    switch (state) {
        case "已接受":
            return "success";
        case "进行中":
            return "";
        case "已拒绝":
            return "error";
        case "已取消":
            return "info"
        default:
            return;
    }
}

const filterTag = (value, row) => {
    return row.state === value
}

//分页器与修改el-table
//#region 
const eltable = ref(null);

const colHeight = computed(() => {
    return parseFloat(window.getComputedStyle(eltable.value.querySelector(".el-table__row")).getPropertyValue("height"));
})

const changeTop = () => {
    eltable.value.querySelector(".el-scrollbar__view").style.transform = `translateY(-${colHeight.value * 10 * (currentPage.value - 1)}px)`;
}
//#endregion

//axios接口
//#region 
onMounted(() => {
    const id = JSON.parse(window.localStorage.getItem("user")).id;
    axios.get("http://localhost:3001/getwelcomebyuser", { params: { id } }).then((res) => {
        if (res.data.status) {
            ElMessage.error("服务器错误，请重试");
        }
        else {
            table.value = res.data.msg.filter(item => new Welcome(item));
        }
    }).catch((err) => {
        console.log(err);
        ElMessage.error("服务器错误，请重试");
    })
})

const modifyRequest = (index, request) => {
    axios.post("http://localhost:3001/modifyrequest", { params: { request } }).then((res) => {
        if (res.data.status) {
            ElMessage.error("操作失败，请重试");
        }
        else {
            table.value[index] = request;
            ElMessage.success("操作成功");
        }
    }).catch((err) => {
        ElMessage.error("操作失败，请重试");
    })
}

const endRequest = (id) => {
    axios.post("http://localhost:3001/endrequest", { params: { id } }).then((res) => {
        if (res.data.status) {
            ElMessage.error("操作失败，请重试");
        }
        else {
            ElMessage.success("操作成功");
        }
    }).catch((err) => {
        ElMessage.error("操作失败，请重试");
    })
}

const getWelcomeById = (id) => {
    axios.get("http://localhost:3001/getwelcomebyid", { params: { id } }).then((res) => {
        if (res.data.status) {
            ElMessage.error("操作失败，请重试");
        }
        else {
            welcomeTable.value = res.data.msg;
            ElMessage.success("操作成功");
        }
    }).catch((err) => {
        ElMessage.error("操作失败，请重试");
    })
}

const acceptWelcome = (id) => {
    axios.post("http://localhost:3001/acceptwelcome", { params: { id } }).then((res) => {
        if (res.data.status) {
            ElMessage.error("操作失败，请重试");
        }
        else {
            welcomeTable.value = res.data.msg;
            ElMessage.success("操作成功");
        }
    }).catch((err) => {
        ElMessage.error("操作失败，请重试");
    })
}
//#endregion
</script>

<style scoped>
.box-card {
    height: 99%;
    background-color: #ffffffaa;
    position: relative;
}

.el-pagination {
    width: calc(100% - 80px);
    justify-content: center;
    position: absolute;
    bottom: 30px;
}
</style>

<style>
.el-scrollbar__wrap {
    overflow: hidden;
}

.el-scrollbar__bar {
    display: none;
}
</style>