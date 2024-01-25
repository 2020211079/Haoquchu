<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <h3 style="margin: 0;">发布欢迎来信息</h3>
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
        <el-table-column prop="createTime" sortable label="请求时间" width="140">
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
        <el-table-column prop="placeType" label="去处类型" width="140" />
        <el-table-column label="最高单价" width="110">
          <template #default="scope">
            ￥{{ scope.row.fee }}.00
          </template>
        </el-table-column>
        <el-table-column label="内容管理">
          <template #default="scope">
            <el-button size="small" @click="showDetail = scope.row">查看内容</el-button>
            <el-button size="small" type="primary" @click="showWelcome = scope.row.id">写回复</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination class="page" background layout="prev, pager, next" :total="table ? table.length : 10"
      v-model:current-page="currentPage" @current-change="changeTop" />
  </el-card>
  <!-- 查看寻去处详细信息 -->
  <el-dialog v-model="showDetail" title="寻去处详细信息" width="75%">
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
  <!-- 修改信息 -->
  <el-dialog v-model="showWelcome" title="发布欢迎来" align-center>
    <el-form :model="form" ref="requestref" :rules="welcomeRules" label-width="80px">
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
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelWelcome(requestref)">取消</el-button>
        <el-button type="primary" @click="submitWelcome(requestref)">
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from 'vue';
import { Request, Welcome } from '@/store/static.js';
import { ElMessage } from 'element-plus';

//#region 查看寻去处
const table = ref(null);
const currentPage = ref(1);
const showDetail = ref(false);

//将el-table改成符合要求的形式
const eltable = ref(null);

const colHeight = computed(() => {
  return parseFloat(window.getComputedStyle(eltable.value.querySelector(".el-table__row")).getPropertyValue("height"));
})

const changeTop = () => {
  eltable.value.querySelector(".el-scrollbar__view").style.transform = `translateY(-${colHeight.value * 10 * (currentPage.value - 1)}px)`;
}
//#endregion

//#region 发布欢迎来
const showWelcome = ref(false);
const form = ref(new Welcome());
const requestref = ref();
const welcomeRules = {
  detail: [
    { required: true, message: "请填写描述", trigger: "blur" },
  ],
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
    console.log(video);
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

const submitWelcome = (formEl) => {
  if (formEl) {
    formEl.validate((valid, fields) => {
      if (valid) {
        const id = JSON.parse(window.localStorage.getItem("user")).id;
        axios.post("http://localhost:3001/submitwelcome",{
          requestID: showWelcome.value,
          userID: id,
          detail: form.value.detail,
          image1: form.value.image1,
          image2: form.value.image2,
          video: form.value.video
        }).then((res) => {
    if (res.data.status) {
      ElMessage.error("服务器错误，请重试");
    }
    else {
      cancelWelcome(formEl);
    }
  }).catch((err) => {
    ElMessage.error("服务器错误，请重试");
  })
      }
    })
  }
}

const cancelWelcome = (formEl) => {
  showWelcome.value = null;
  form.value = new Welcome();
  formEl.resetFields();
}
//#endregion

//#region onMounted
onMounted(() => {
  const id = JSON.parse(window.localStorage.getItem("user")).id;
  axios.get("http://localhost:3001/getrequestbyuser", { params: { id } }).then((res) => {
    if (res.data.status) {
      ElMessage.error("服务器错误，请重试");
    }
    else {
      table.value = res.data.msg.filter(item => new Request(item));
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
