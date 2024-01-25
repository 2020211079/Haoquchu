<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <h3 style="margin: 0;">发布寻去处信息</h3>
      </div>
    </template>
    <el-form :model="form" ref="requestref" :rules="requestRules" label-width="120px">
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
            <el-upload class="avatar-uploader" action="http://localhost:3001/uploadresource" :data="{ id: form.id }" :show-file-list="false"
              :on-success="handleImg1Success" :before-upload="beforeImgUpload">
              <img v-if="form.image1" :src="form.image1 && require(`../../assets/user/${form.id}/${form.image1}`)"
                class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Picture />
              </el-icon>
            </el-upload>
          </el-col>
          <el-col :span="8">
            <el-upload class="avatar-uploader" action="http://localhost:3001/uploadresource" :data="{ id: form.id }" :show-file-list="false"
              :on-success="handleImg2Success" :before-upload="beforeImgUpload">
              <img v-if="form.image2" :src="form.image2 && require(`../../assets/user/${form.id}/${form.image2}`)"
                class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Picture />
              </el-icon>
            </el-upload>
          </el-col>
          <el-col :span="8">
            <el-upload class="avatar-uploader" action="http://localhost:3001/uploadresource" :data="{ id: form.id }" :show-file-list="false"
              :on-success="handleVideoSuccess" :before-upload="beforeVideoUpload">
              <video v-if="form.video" :src="form.video && require(`../../assets/user/${form.id}/${form.video}`)" controls
                class="avatar"></video>
              <el-icon v-else class="avatar-uploader-icon">
                <VideoCamera />
              </el-icon>
            </el-upload>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="最高单价" prop="fee">
        <el-input-number v-model="form.fee" :step="100" :min="0" :max="500" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitRequest(requestref)">确认</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import axios from 'axios';
import { Request } from "@/store/static";
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

//#region 表单处理函数
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

const submitRequest = (formEl) => {
  if (formEl) {
    formEl.validate((valid, fields) => {
      if (valid) {
        axios.post("http://localhost:3001/submitrequest", {
          id: form.value.id,
          placeType: form.value.placeType,
          title: form.value.title,
          detail: form.value.detail,
          image1: form.value.image1,
          image2: form.value.image2,
          video: form.value.video,
          fee: form.value.fee
        }).then((res) => {
          if (res.data.status) {
            ElMessage.error("服务器错误，请重试");
          }
          else {
            //清空表单
            form.value = new Request();
            const user = JSON.parse(window.localStorage.getItem("user"));
            form.value.id = user.id;
            ElMessage.success("发送成功");
          }

        }).catch((err) => {
          ElMessage.error("服务器错误，请重试");
        })
      }
    })
  }
}
//#endregion

//图片处理相关函数
//#region
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
//#endregion

//#region onMounted
//Request的id未使用，可用于存储用户的id
onMounted(() => {
  const user = JSON.parse(window.localStorage.getItem("user"));
  form.value.id = user.id;
})
//#endregion
</script>

<style scoped>
.box-card {
  height: 99%;
  background-color: #ffffffaa;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
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
