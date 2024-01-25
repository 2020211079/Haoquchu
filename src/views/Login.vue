<template>
    <img class="bg-img" src="../assets/login.png">
    <div class="container-container">
        <div class="container">
            <div class="form-box" :style="`transform:translateX(${transform ? 80 : 0}%)`">
                <!-- 注册 -->
                <div :class="`register-box ${transform ? '' : 'hidden'}`">
                    <h1>register</h1>
                    <input type="text" placeholder="用户名" v-model="form.username">
                    <input type="password" placeholder="密码" v-model="form.password">
                    <input type="password" placeholder="确认密码" v-model="form.confirmPassword">
                    <div class="city-selector">
                        <span v-show="!(form.province && form.city)">所在地区：未选择</span>
                        <span v-show="(form.province && form.city)">{{ form.province + form.city }}</span>
                        <button class="side-button" @click="choosePlace = true">选择城市</button>
                    </div>
                    <span class="warning">{{ registerWarning }}</span>
                    <button class="bottom-button" @click="register">注册</button>
                </div>
                <!-- 登录 -->
                <div :class="`login-box ${transform ? 'hidden' : ''}`">
                    <h1>login</h1>
                    <input type="text" placeholder="用户名" v-model="form.username">
                    <input type="password" placeholder="密码" v-model="form.password">
                    <span class="warning">{{ loginWarning }}</span>
                    <button class="bottom-button" @click="login">登录</button>
                </div>
            </div>
            <div class="con-box left">
                <h2>好去处</h2>
                <p>一站式出行交互平台</p>
                <img width="100" style="box-shadow:2px 2px 2px #00000055" src="../assets/decoration1.png" alt="">
                <p style="color:#ddd;">已有账号?</p>
                <button class="switch-button" @click="transform = false">去登录</button>
            </div>
            <div class="con-box right">
                <h2>好去处</h2>
                <p>一站式出行交互平台</p>
                <img width="100" style="box-shadow:2px 2px 2px #00000055" src="../assets/decoration2.png" alt="">
                <p style="color:#ddd;">没有账号?</p>
                <button class="switch-button" @click="transform = true">去注册</button>
            </div>
        </div>
    </div>
    <!-- 地区选择 -->
    <el-drawer v-model="choosePlace" title="选择地区" direction="rtl">
        <el-form :model="form" label-width="120px">
            <el-divider></el-divider>
            <el-form-item label="选择省份">
                <el-radio-group v-model="form.province" @change="form.city = ''">
                    <el-radio v-for="(item) in placeData" :key="item.province" :label="item.province" />
                </el-radio-group>
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item label="选择城市">
                <el-radio-group v-model="form.city">
                    <el-radio
                        v-for="(item) in (form.province ? placeData.find((item) => { return item.province === form.province }).children : null)"
                        :key="item" :label="item" />
                </el-radio-group>
            </el-form-item>
            <el-divider></el-divider>
        </el-form>
        <el-button type="success" style="margin-left: 190px;" :disabled="!(form.province && form.city)"
            @click="choosePlace = false">确定</el-button>
    </el-drawer>
</template>

<script setup>
import router from '@/router';
import axios from 'axios';
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
const transform = ref(false);
const choosePlace = ref(false);
const registerWarning = ref("");
const loginWarning = ref("");
const form = reactive({
    username: "",
    password: "",
    confirmPassword: "",
    province: "",
    city: ""
})

const placeData = [
    {
        province: "北京市",
        children: ["东城区", "西城区", "朝阳区", "丰台区", "石景山区", "海淀区", "顺义区", "通州区", "大兴区", "房山区", "门头沟区", "昌平区", "平谷区", "密云区", "怀柔区", "延庆区"]
    },
    {
        province: "天津市",
        children: ["和平区", "河东区", "河西区", "南开区", "河北区", "红桥区", "滨海新区", "东丽区", "西青区", "津南区", "北辰区", "武清区", "宝坻区", "宁河区", "静海区", "蓟州区"]
    },
    {
        province: "河北省",
        children: ["石家庄市", "唐山市", "秦皇岛市", "邯郸市", "邢台市", "保定市", "张家口市", "承德市", "沧州市", "廊坊市", "衡水市"]
    },
    {
        province: "山西省",
        children: ["大同市", "朔州市", "忻州市", "阳泉市", "吕梁市", "晋中市", "长治市", "晋城市", "临汾市", "运城市"]
    },
]

const checkPassword = (password) => {
    // 检查密码长度  
    if (password.length < 6 || password.length > 8) {
        return "密码长度为6到8位";
    }

    // 检查是否至少包含两个数字  
    let digitCount = password.match(/\d/g);
    if (digitCount < 2) {
        return "密码至少包含2个数字";
    }

    // 检查是否同时包含大写和小写字母  
    let hasUppercase = /[A-Z]/.test(password);
    let hasLowercase = /[a-z]/.test(password);
    if (!hasUppercase || !hasLowercase) {
        return "密码必须包含大写和小写字母";
    }

    // 所有条件都满足，返回true  
    return "";
}

//#region 用户注册
const register = () => {
    if (form.username.length < 4 || form.username.length > 10) {
        registerWarning.value = "用户名的长度需要为4-10位";
        return;
    }
    const info = checkPassword(form.password);
    if (info) {
        registerWarning.value = info;
        return;
    }
    if (form.password !== form.confirmPassword) {
        registerWarning.value = "两次密码不一致";
        return;
    }
    if (!(form.province && form.city)) {
        registerWarning.value = "请先选择地区";
        return;
    }
    axios.post("http://localhost:3001/register", { 
        username: form.username, 
        password: form.password,
        city: form.province + form.city
     }).then((res) => {
        if(res.data.status){
            console.log(res.data.msg);
            registerWarning.value = "服务器故障，请重试";
        }
        else {
            ElMessage.success("注册成功，请重新登录");
        }
    }).catch((err)=>{
        ElMessage.error("服务器错误，请重试");
    })
}
//#endregion

import { useStore } from "../store/index.js";
const store = useStore();

//#region 用户登录
const login = () => {
    if (form.username.length < 4 || form.username.length > 10) {
        loginWarning.value = "用户名的长度需要为4-10位";
        return;
    }
    const info = checkPassword(form.password);
    if (info) {
        loginWarning.value = info;
        return;
    }
    axios.get("http://localhost:3001/login", { params: { username: form.username, password: form.password } }).then((res) => {
        if(res.data.status || res.data.msg.length === 0){
            loginWarning.value = "用户名或密码有误";
        }
        else {
            window.localStorage.setItem("user",JSON.stringify(res.data.msg));
            router.push('/home')
        }
    }).catch((err)=>{
        ElMessage.error("服务器错误，请重试");
    })
}
//#endregion

</script>

<style scoped>
.bg-img {
    width: 100%;
    height: 100%;
    position: absolute;
}

.container-container {
    height: 100%;
    width: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    background-color: #ffffff55;
    backdrop-filter: blur(3px);
    width: 650px;
    height: 415px;
    border-radius: 5px;
    /* 阴影 */
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
    /* 相对定位 */
    position: relative;
}

.form-box {
    /* 绝对定位 */
    position: absolute;
    top: -10%;
    left: 5%;
    background: url("../assets/login-mask.png");
    width: 320px;
    height: 500px;
    border-radius: 5px;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    /* 动画过渡 加速后减速 */
    transition: 0.5s ease-in-out;
}

.register-box,
.login-box {
    /* 弹性布局 垂直排列 */
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.hidden {
    display: none;
    transition: 0.5s;
}

h1 {
    text-align: center;
    margin-bottom: 25px;
    /* 大写 */
    text-transform: uppercase;
    color: #fff;
    /* 字间距 */
    letter-spacing: 5px;
}

input,
.city-selector {
    background-color: transparent;
    width: 70%;
    color: #fff;
    border: none;
    /* 下边框样式 */
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
    padding: 10px 0;
    text-indent: 10px;
    margin: 8px 0;
    font-size: 14px;
    letter-spacing: 2px;
}

.city-selector {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 4px 0;
    color: #eee;
}

input::placeholder {
    color: #fff;
}

input:focus {
    color: orange;
    outline: none;
    border-bottom: 1px solid rgba(255, 165, 0, 0.8);
    transition: 0.5s;
}

input:focus::placeholder {
    opacity: 0;
}

.bottom-button {
    width: 70%;
    background-color: limegreen;
    outline: none;
    border-radius: 8px;
    padding: 13px;
    color: #fff;
    letter-spacing: 2px;
    border: none;
    cursor: pointer;
    margin-top: 15px;
}

.side-button {
    background-color: limegreen;
    outline: none;
    border-radius: 8px;
    color: #fff;
    letter-spacing: 2px;
    border: none;
    cursor: pointer;
    height: 30px;
    line-height: 30px;
}

.form-box button:hover {
    background-color: lawngreen;
    color: #f6f6f6;
    transition: background-color 0.5s ease;
}

.con-box {
    width: 50%;
    /* 弹性布局 垂直排列 居中 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* 绝对定位 居中 */
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}

.con-box.left {
    left: -2%;
}

.con-box.right {
    right: -2%;
}

.con-box h2 {
    color: #8e9aaf;
    font-size: 25px;
    font-weight: bold;
    letter-spacing: 3px;
    text-align: center;
    margin-bottom: 4px;
}

.con-box p {
    font-size: 12px;
    letter-spacing: 2px;
    color: #8e9aaf;
    text-align: center;
}

.con-box img {
    width: 150px;
    height: 150px;
    opacity: 0.9;
    margin: 30px 0 20px;
}

.con-box button {
    margin-top: -5px;
    background-color: limegreen;
    color: #fff;
    border: 1px solid limegreen;
    padding: 6px 10px;
    border-radius: 5px;
    letter-spacing: 1px;
    outline: none;
    cursor: pointer;
}

.con-box button:hover {
    background-color: lawngreen;
}

.warning {
    font-size: 12px;
    color: orange;
}
</style>