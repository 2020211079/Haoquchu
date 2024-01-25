<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <h3 style="margin: 0;">个人信息</h3>
      </div>
    </template>
    <el-row :gutter="20">
      <el-col :span="12">
        <h4>完善信息</h4>
        <el-divider />
        <el-form :model="form" :rules="identityRules" ref="identityref" label-width="120px">
          <el-form-item label="用户名">
            <el-input v-model="form.username" placeholder="待完善" disabled />
          </el-form-item>
          <el-form-item v-if="!perfect" label="电话号码" prop="tel">
            <el-input v-model="form.tel" placeholder="待完善" />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="待完善" :disabled="perfect" />
          </el-form-item>
          <el-form-item label="证件类型" prop="identityType">
            <el-select v-model="form.identityType" placeholder="请选择" :disabled="perfect">
              <el-option label="居民身份证" :value="1" />
              <el-option label="港澳通行证" :value="2" />
              <el-option label="台胞证" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="证件号" prop="identity">
            <el-input v-model="form.identity" placeholder="待完善" :disabled="perfect" />
          </el-form-item>
          <el-form-item label="所在地区">
            <el-input v-model="form.city" placeholder="待完善" disabled />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateIdentity(identityref)" :disabled="perfect">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <h4>其他信息</h4>
        <el-divider />
        <el-form :model="form" label-width="120px">
          <el-form-item label="头像">
            <el-upload class="avatar-uploader" action="http://localhost:3001/uploadavatar" :data="{ id: form.id }"
              :show-file-list="false" :on-success="ImageUploadSuccess" :before-upload="beforeImgUpload">
              <img v-if="form.avatar" :src="form.avatar && require(`../assets/user/${form.id}/${form.avatar}`)"
                class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="密码">
            <el-input placeholder="********" disabled>
              <template #append>
                <el-button @click="showChangePassword = true">修改</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="perfect" label="电话号码">
            <el-input :placeholder="form.tel ? form.tel.substring(0, 3) + '***' + form.tel.substring(7, 11) : '待完善'"
              disabled>
              <template #append>
                <el-button @click="showChangeTel = true">修改</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="个人简介">
            <el-input v-model="form.memo" type="textarea" placeholder="最多100字" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateMemo">提交修改</el-button>
          </el-form-item>

          <el-form-item label="会员信息" v-if="!form.isVIP">
            <el-link type="info">您还不是VIP会员，点击成为会员</el-link>
          </el-form-item>
          <el-form-item label="会员信息" v-if="form.isVIP">
            <el-link type="success">您已经是VIP会员</el-link>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
  <!-- 修改电话的弹窗 -->
  <el-dialog v-model="showChangeTel" title="修改电话">
    <el-form :model="newTel" :rules="telRules" ref="telref">
      <el-form-item label="电话" prop="newTel">
        <el-input v-model="newTel.newTel" placeholder="请填写" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelTel(telref)">取消</el-button>
        <el-button type="primary" @click="updateTel(telref)">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 修改密码的弹窗 -->
  <el-dialog v-model="showChangePassword" title="修改密码">
    <el-form :model="newPassword" :rules="passwordRules" ref="passwordref">
      <el-form-item label="原始密码" prop="oldPassword">
        <el-input show-password v-model="newPassword.oldPassword" placeholder="请填写" />
      </el-form-item>
      <el-form-item label="修改密码" prop="newPassword">
        <el-input show-password v-model="newPassword.newPassword" placeholder="请填写" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input show-password v-model="newPassword.confirmPassword" placeholder="请填写" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelPassword(passwordref)">取消</el-button>
        <el-button type="primary" @click="updatePassword(passwordref)">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import axios from 'axios';
import { User } from '@/store/static';
import { ref, onMounted, reactive } from 'vue';
import { ElMessage } from 'element-plus';

//#region 完善信息的处理函数
const form = ref(new User());
const perfect = ref(false);
const identityref = ref();
const identityRules = {
  name: [
    { required: true, message: "请填写姓名", trigger: "blur" },
    { min: 2, max: 10, message: "姓名长度为2到10", trigger: "blur" }
  ],
  identityType: [
    { required: true, message: "请选择证件类型", trigger: "blur" }
  ],
  identity: [
    { required: true, message: "请填写姓名", trigger: "blur" },
    { min: 18, max: 18, message: "身份证号长度为18位", trigger: "blur" }
  ],
  tel: [
    { required: true, message: "请填写电话", trigger: "blur" },
    { min: 11, max: 11, message: "电话长度为11位", trigger: "blur" }
  ]
}

const updateIdentity = (formEl) => {
  if (formEl) {
    formEl.validate((valid, fields) => {
      if (valid) {
        axios.post("http://localhost:3001/updateidentity", {
          name: form.value.name,
          identityType: form.value.identityType,
          identity: form.value.identity,
          tel: form.value.tel,
          id: form.value.id
        }).then((res) => {
          //提交完成后，锁定系统，一份提交前端，一份提交后端。
          window.localStorage.setItem('user', JSON.stringify(form.value));
          perfect.value = true;
          ElMessage.success("修改成功");
        }).catch((err) => {
          ElMessage.error("服务器错误，请重试");
        })
      }
    })
  }
}
//#endregion

//#region 头像更新函数
import { useStore } from "../store/index.js";
const store = useStore();
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

const ImageUploadSuccess = (res) => {
  if (res.status) {
    ElMessage.error("服务器错误，请重试");
  }
  else {
    //修改当前头像路径，并且更新，通知header同步更改
    window.localStorage.setItem('user', JSON.stringify(form.value));
    form.value.avatar = res.msg;
    store.setAvatar(res.msg);
  }
}
//#endregion

//#region 密码修改函数
const showChangePassword = ref(false);
const passwordref = ref();
const newPassword = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
})

const passwordRules = {
  oldPassword: [
    { required: true, message: "请填写原密码", trigger: "blur" },
    { pattern: /(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).+/, message: "密码必须包括数字、大小写字母", trigger: "blur" },
    { min: 6, max: 8, message: "密码长度为6到8位", trigger: "blur" }
  ],
  newPassword: [
    { required: true, message: "请填写新密码", trigger: "blur" },
    { pattern: /(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).+/, message: "密码必须包括数字、大小写字母", trigger: "blur" },
    { min: 6, max: 8, message: "密码长度为6到8位", trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    { pattern: /(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).+/, message: "密码必须包括数字、大小写字母", trigger: "blur" },
    { min: 6, max: 8, message: "密码长度为6到8位", trigger: "blur" }
  ],
}

const updatePassword = (formEl) => {
  formEl.validate((valid, fields) => {
    if (valid) {
      if (newPassword.oldPassword !== form.value.password) {
        ElMessage.error("原密码不正确");
        return;
      }
      if (newPassword.confirmPassword !== newPassword.newPassword) {
        ElMessage.error("两次密码不一致");
        return;
      }
      axios.post("http://localhost:3001/updatepassword", {
        password: newPassword.newPassword,
        id: form.value.id
      }).then((res) => {
        //提交完成后，锁定系统，一份提交前端，一份提交后端。
        form.value.password = newPassword.newPassword;
        window.localStorage.setItem('user', JSON.stringify(form.value));
        cancelPassword(formEl);
        ElMessage.success("修改成功");
      }).catch((err) => {
        ElMessage.error("服务器错误，请重试");
      })
    }
  })
}

const cancelPassword = (formEl) => {
  showChangePassword.value = false;
  newPassword.confirmPassword = "";
  newPassword.oldPassword = "";
  newPassword.newPassword = "";
  formEl.resetFields();
}
//#endregion

//#region 电话修改函数
const showChangeTel = ref(false);
const telref = ref();
const newTel = reactive({
  newTel: ""
})
const telRules = {
  newTel: [
    { required: true, message: "请填写电话", trigger: "blur" },
    { min: 11, max: 11, message: "电话长度为11位", trigger: "blur" }
  ]
}

const updateTel = (formEl) => {
  formEl.validate((valid, fields) => {
    if (valid) {
      axios.post("http://localhost:3001/updatetel", {
        tel: newTel.newTel,
        id: form.value.id
      }).then((res) => {
        //提交完成后，锁定系统，一份提交前端，一份提交后端。
        form.value.tel = newTel.newTel;
        window.localStorage.setItem('user', JSON.stringify(form.value));
        cancelTel(formEl);
        ElMessage.success("修改成功");
      }).catch((err) => {
        ElMessage.error("服务器错误，请重试");
      })
    }
  })
}

const cancelTel = (formEl) => {
  showChangeTel.value = false;
  newTel.newTel = "";
  formEl.resetFields();
}
//#endregion

//#region 简介修改函数
const updateMemo = () => {
  axios.post("http://localhost:3001/updatememo", {
    memo: form.value.memo,
    id: form.value.id
  }).then((res) => {
    //提交完成后，锁定系统，一份提交前端，一份提交后端。
    if (res.data.status) {
      ElMessage.error("服务器错误，请重试");
    }
    else {
      window.localStorage.setItem('user', JSON.stringify(form.value));
      ElMessage.success("修改成功");
    }

  }).catch((err) => {
    ElMessage.error("服务器错误，请重试");
  })
}
//#endregion

//#region VIP修改函数
//题目未做要求
//#endregion

//#region onMounted
onMounted(() => {
  form.value = JSON.parse(window.localStorage.getItem("user"));
  perfect.value = form.value.name && form.value.identity && form.value.identityType && form.value.tel
})
//#endregion
</script>

<style scoped>
.box-card {
  height: 99%;
  background-color: #ffffffaa;
}

.avatar-uploader .avatar {
  width: 120px;
  height: 120px;
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
  width: 120px;
  height: 120px;
  text-align: center;
}
</style>