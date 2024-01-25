<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <h3 style="margin: 0;">查询寻去处信息</h3>
      </div>
    </template>
    <div ref="eltable">
      <el-table :data="isWelcome ? welcomeTable : requestTable" :height="460" stripe style="width: 100%; margin-top:5px;">
        <el-table-column v-if="isWelcome" prop="username" label="回复用户" width="180" />
        <el-table-column v-if="!isWelcome" label="标题" width="200">
          <template #default="scope">
            <abbr v-if="scope.row.title.length > 10" :title="scope.row.title" style="text-decoration: none;">{{
              scope.row.title.substring(0, 10) }}……</abbr>
            <span v-else>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fixTime" sortable label="请求时间" width="140">
          <template #default="scope">
            {{ scope.row.createTime.substring(0, 10) }}
          </template>
        </el-table-column>
        <el-table-column prop="fixTime" sortable label="最后修改时间" width="140">
          <template #default="scope">
            {{ scope.row.fixTime.substring(0, 10) }}
          </template>
        </el-table-column>
        <el-table-column sortable label="截止时间" width="120">
          <template #default="scope">
            {{ scope.row.endTime ? scope.row.endTime.substring(0, 10) : "进行中" }}
          </template>
        </el-table-column>
        <el-table-column v-if="!isWelcome" prop="placeType" label="去处类型" width="140" />
        <el-table-column label="请求状态" width="100" :filters="[
          { text: '已接受', value: '已完成' },
          { text: '已完成', value: '已完成' },
          { text: '进行中', value: '进行中' },
          { text: '已拒绝', value: '已取消' },
          { text: '已取消', value: '已取消' },
          { text: '已过期', value: '已过期' },
          { text: '已失效', value: '已过期' },
        ]" :filter-method="filterTag" filter-placement="bottom-end">
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
        <el-table-column label="内容管理">
          <template #default="scope">
            <el-button size="small" @click="showDetail = scope.row">查看内容</el-button>
            <el-button v-if="!isWelcome" size="small" @click="getWelcomeById(scope.row.id)"
              :disabled="scope.row.state === '已取消'">查看回复</el-button>
            <el-button v-if="!isWelcome" size="small" :disabled="scope.row.state !== '进行中'"
              @click="showModify = true; form = scope.row">修改</el-button>
            <el-button v-if="!isWelcome" size="small" type="danger" :disabled="scope.row.state !== '进行中'"
              @click="endRequest(scope.row.id)">取消</el-button>
            <el-button v-if="isWelcome" size="small" @click="showUser = scope.row">查看用户</el-button>
            <el-button v-if="isWelcome" size="small" type="success" :disabled="scope.row.state !== '进行中'"
              @click="acceptWelcome(scope.row.id, scope.row.requestID, requestTable.find(item => item.id === scope.row.requestID).placeType)">接受</el-button>
            <el-button v-if="isWelcome" size="small" type="danger" :disabled="scope.row.state !== '进行中'"
              @click="refuseWelcome(scope.row.id)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination v-if="isWelcome" class="page" background layout="prev, pager, next"
      :total="welcomeTable ? welcomeTable.length : 10" v-model:current-page="currentPage" @current-change="changeTop" />
    <el-pagination v-else class="page" background layout="prev, pager, next"
      :total="requestTable ? requestTable.length : 10" v-model:current-page="currentPage" @current-change="changeTop" />
  </el-card>
  <!-- 查看寻去处详细信息 -->
  <el-dialog v-model="showDetail" title="寻去处详细信息" width="75%">
    <el-descriptions :title="isWelcome ? '' : showDetail.title" :column="3" border>
      <el-descriptions-item>
        <template #label>
          <div>
            <el-icon>
              <Picture />
            </el-icon>
            图片信息1
          </div>
        </template>
        <img v-if="showDetail.image1"
          :src="showDetail.image1 && require(`../../assets/user/${showDetail.userID}/${showDetail.image1}`)" width="200"
          height="200" />
        <el-empty v-else description="无" :image-size="200" />
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
        <img v-if="showDetail.image2"
          :src="showDetail.image2 && require(`../../assets/user/${showDetail.userID}/${showDetail.image2}`)" width="200"
          height="200" />
        <el-empty v-else description="无" :image-size="200" />
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
        <video v-if="showDetail.video"
          :src="showDetail.video && require(`../../assets/user/${showDetail.userID}/${showDetail.video}`)" width="200"
          height="200" controls />
        <el-empty v-else description="无" :image-size="200" />
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
  <!-- 查看寻去处用户信息 -->
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
  <!-- 修改信息 -->
  <el-dialog v-model="showModify" title="修改欢迎来" align-center>
    <el-form :model="form" ref="requestref" :rules="requestRules" label-width="80px">
      <el-form-item label="请求主题" prop="title">
        <el-input placeholder="不超过20字" maxlength="20" show-word-limit v-model="form.title" />
      </el-form-item>
      <el-form-item label="去处类型" prop="placeType">
        <el-select v-model="form.placeType" placeholder="选择标签">
          <el-option label="钓鱼" value="钓鱼" />
          <el-option label="老少皆宜休闲" value="老少皆宜休闲" />
          <el-option label="农家院" value="农家院" />
          <el-option label="温泉度假" value="温泉度假" />
          <el-option label="僻静休闲" value="僻静休闲" />
          <el-option label="游乐场" value="游乐场" />
        </el-select>
      </el-form-item>
      <el-form-item label="请求描述" prop="detail">
        <el-input v-model="form.detail" type="textarea" placeholder="不超过100字" maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item label="上传资源">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-upload class="avatar-uploader" action="http://localhost:3001/uploadresource" :data="{ id: form.userID }"
              :show-file-list="false" :on-success="handleImg1Success" :before-upload="beforeImgUpload">
              <img v-if="form.image1" :src="form.image1 && require(`../../assets/user/${form.userID}/${form.image1}`)"
                class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Picture />
              </el-icon>
            </el-upload>
          </el-col>
          <el-col :span="8">
            <el-upload class="avatar-uploader" action="http://localhost:3001/uploadresource" :data="{ id: form.userID }"
              :show-file-list="false" :on-success="handleImg2Success" :before-upload="beforeImgUpload">
              <img v-if="form.image2" :src="form.image2 && require(`../../assets/user/${form.userID}/${form.image2}`)"
                class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Picture />
              </el-icon>
            </el-upload>
          </el-col>
          <el-col :span="8">
            <el-upload class="avatar-uploader" action="http://localhost:3001/uploadresource" :data="{ id: form.userID }"
              :show-file-list="false" :on-success="handleVideoSuccess" :before-upload="beforeVideoUpload">
              <video v-if="form.video" :src="form.video && require(`../../assets/user/${form.userID}/${form.video}`)"
                controls class="avatar"></video>
              <el-icon v-else class="avatar-uploader-icon">
                <VideoCamera />
              </el-icon>
            </el-upload>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-if="!isWelcome" label="最高单价" prop="fee">
        <el-input-number v-model="form.fee" :step="100" :min="0" :max="500" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelModify(requestref)">取消</el-button>
        <el-button type="primary" @click="modifyRequest(requestref)">
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from 'vue';
import { Request } from '@/store/static.js';
import { ElMessage } from 'element-plus';

//#region 表格控制函数
const requestTable = ref(null);
const welcomeTable = ref(null);
const isWelcome = ref(false);
const currentPage = ref(1);
const showDetail = ref(false);
const showUser = ref(false);

const getTag = (state) => {
  switch (state) {
    case "已完成":
      return "success";
    case "进行中":
      return "";
    case "已取消":
      return "danger";
    case "已过期":
      return "info"
    default:
      return;
  }
}

const filterTag = (value, row) => {
  return row.state === value
}

//将el-table改成符合要求的形式
const eltable = ref(null);

const colHeight = computed(() => {
  return parseFloat(window.getComputedStyle(eltable.value.querySelector(".el-table__row")).getPropertyValue("height"));
})

const changeTop = () => {
  eltable.value.querySelector(".el-scrollbar__view").style.transform = `translateY(-${colHeight.value * 10 * (currentPage.value - 1)}px)`;
}
//#endregion

//#region 修改请求
const showModify = ref(false);
const form = ref(new Request());
const requestref = ref();
const requestRules = {
  title: [
    { required: true, message: "请填写主题", trigger: "blur" },
  ],
  placeType: [
    { required: true, message: "请选择类型", trigger: "blur" },
  ],
  detail: [
    { required: true, message: "请填写描述", trigger: "blur" },
  ],
  fee: [
    { required: true, message: "请选择单价", trigger: "blur" },
  ]
}

const cancelModify = (formEl) => {
  form.value = new Request();
  formEl.resetFields();
  showModify.value = false;
}

const modifyRequest = (formEl) => {
  if (formEl) {
    formEl.validate((valid, fields) => {
      if (valid) {
        axios.post("http://localhost:3001/modifyrequest", {
          placeType: form.value.placeType,
          title: form.value.title,
          detail: form.value.detail,
          image1: form.value.image1,
          image2: form.value.image2,
          video: form.value.video,
          fee: form.value.fee,
          id: form.value.id
        }).then((res) => {
          if (res.data.status) {
            console.log(res.data.msg)
            ElMessage.error("操作失败，请重试");
          }
          else {
            //更新前端，清除表单，关闭窗口
            requestTable.value.forEach((item) => {
              if (item.id === form.value.id) {
                item = form.value;
              }
            })
            cancelModify(formEl);
            ElMessage.success("操作成功");
          }
        }).catch((err) => {
          ElMessage.error("操作失败，请重试");
        })
      }
    })
  }
}

//格式检测
const beforeImgUpload = (file) => {
  if (file.type !== "image/png" && file.type !== "image/jpeg") {
    ElMessage.error('请上传JPG或PNG格式');
    return false;
  }
  else if (file.size / 1024 / 1024 > 2) {
    ElMessage.error('上传的文件大小不能超过2MB');
    return false;
  }
  else {
    return true;
  }
}

const beforeVideoUpload = (video) => {
  if (video.type !== "video/mp4") {
    ElMessage.error('请上传MP4格式');
    return false;
  }
  else if (video.size / 1024 / 1024 > 4) {
    ElMessage.error('上传的文件大小不能超过4MB');
    return false;
  }
  else {
    return true;
  }
}

//图片显示
const handleImg1Success = (res) => {
  if (res.status) {
    ElMessage.error("服务器错误，请重试");
  }
  else {
    form.value.image1 = res.msg;
  }
}

const handleImg2Success = (res) => {
  if (res.status) {
    ElMessage.error("服务器错误，请重试");
  }
  else {
    form.value.image2 = res.msg;
  }
}

const handleVideoSuccess = (res) => {
  if (res.status) {
    ElMessage.error("服务器错误，请重试");
  }
  else {
    form.value.video = res.msg;
  }
}
//#endregion

//#region 查看欢迎来
const getWelcomeById = (id) => {
  axios.get("http://localhost:3001/getwelcomebyid", { params: { id } }).then((res) => {
    if (res.data.status) {
      ElMessage.error("操作失败，请重试");
    }
    else {
      welcomeTable.value = res.data.msg;
      isWelcome.value = true;
      ElMessage.success("操作成功");
    }
  }).catch((err) => {
    ElMessage.error("操作失败，请重试");
  })
}

const acceptWelcome = (welcomeID, requestID, placeType) => {
  axios.post("http://localhost:3001/acceptwelcome", { requestID, welcomeID, placeType }).then((res) => {
    if (res.data.status) {
      ElMessage.error("操作失败，请重试");
    }
    else {
      //同步requestTable和welcomeTable
      requestTable.value.forEach((item) => {
        if (item.requestID === requestID) {
          item.state = "已完成";
        }
      })
      welcomeTable.value.forEach((item) => {
        if (item.id === welcomeID) {
          item.state = "已接受";
        }
      })
      ElMessage.success("操作成功");
    }
  }).catch((err) => {
    console.log(err)
    ElMessage.error("操作失败，请重试");
  })
}

const refuseWelcome = (id) => {
  axios.post("http://localhost:3001/refusewelcome", { id }).then((res) => {
    if (res.data.status) {
      ElMessage.error("操作失败，请重试");
    }
    else {
      //同步welcomeTable
      welcomeTable.value.forEach((item) => {
        if (item.id === id) {
          item.state = "已拒绝";
        }
      })
      ElMessage.success("操作成功");
    }
  }).catch((err) => {
    console.log(err);
    ElMessage.error("操作失败，请重试");
  })
}
//#endregion

//#region 结束请求
const endRequest = (id) => {
  axios.post("http://localhost:3001/endrequest", { id }).then((res) => {
    if (res.data.status) {
      ElMessage.error("操作失败，请重试");
    }
    else {
      requestTable.value.forEach(item => {
        if (item.id === id) {
          item.state = "已取消";
          item.endTime = "已取消";
        }
      });
      ElMessage.success("操作成功");
    }
  }).catch((err) => {
    console.log(err);
    ElMessage.error("操作失败，请重试");
  })
}
//#endregion

//axios接口
//#region 

//#endregion

//#region onMounted
onMounted(() => {
  const id = JSON.parse(window.localStorage.getItem("user")).id;
  axios.get("http://localhost:3001/getrequestbyuser", { params: { id } }).then((res) => {
    if (res.data.status) {
      ElMessage.error("服务器错误，请重试");
    }
    else {
      requestTable.value = res.data.msg.filter(item => new Request(item));
    }
  }).catch((err) => {
    console.log(err);
    ElMessage.error("服务器错误，请重试");
  })
})
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

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.el-scrollbar__wrap {
  overflow: hidden;
}

.el-scrollbar__bar {
  display: none;
}

.el-empty {
  padding: 0;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>