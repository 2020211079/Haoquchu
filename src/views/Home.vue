<template>
    <el-row :gutter="20">
        <el-col :span="12" style="height: 600px; display: flex;">
            <div class="container">
                <img class="image" width="360" height="240" src="../assets/request.jpg" alt="">
                <div class="card">
                    <div class="head">
                        寻去处
                    </div>
                    <div class="content-box">
                        <div class="content">发布去处信息，让当地朋友帮您寻找合适的去处。</div>
                        <el-button class="button" type="warning" plain @click="clickMenu('/request')">去发布</el-button>
                    </div>
                </div>
            </div>
        </el-col>
        <el-col :span="12" style="display: flex;">
            <div class="container">
                <img class="image" width="360" height="240" src="../assets/welcome.jpg" alt="">
                <div class="card">
                    <div class="head">
                        欢迎来
                    </div>
                    <div class="content-box">
                        <div class="content">发布欢迎信息，让外地朋友寻找自己喜欢的去处。</div>
                        <el-button class="button" type="success" plain @click="clickMenu('/welcome')">去发布</el-button>
                    </div>
                </div>
            </div>
        </el-col>
    </el-row>
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
import { ref } from 'vue';
import { useRouter } from "vue-router";
const router = useRouter();
const showInfo = ref(false);
const clickMenu = (url) => {
    const user = JSON.parse(window.localStorage.getItem('user'));
    const Login = user && user.name && user.identity && user.identityType && user.tel;
    if(!Login){
        showInfo.value = true;
    }
    else
        router.push(url);
}
</script>

<style lang="scss" scoped>
.container {
    width: 360px;
    margin: auto;
    display: flex;
    flex-direction: column;
    transition: transform 0.5s;
}

.container:hover {
    transform: translateY(-10px);
}

.image {
    border-radius: 10px;
    box-shadow: 2px 2px 2px #00000055;
    // clip-path: polygon(0 0,100% 0,100% 100%,110px 100%,110px 190px,0 190px);
}

.card {
    width: 360px;
    height: 120px;
    box-sizing: border-box;
    background-color: #ffffffaa;
    margin-top: 10px;
    border: 1px solid #fff;
    border-radius: 0 10px 10px 10px;
    position: relative;
    box-shadow: 2px 2px 2px #00000055;
    display: flex;
}

.head {
    position: absolute;
    width: 100px;
    height: 50px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: #222;
    line-height: 50px;
    background-color: #ffffffaa;
    border: 1px solid #fff;
    border-bottom: none;
    border-radius: 10px 10px 0 0;
    left: -1px;
    top: -50px;
}

.content-box {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.content {
    font-family: "等线";
}

.button {
    margin-top: 20px;
}
</style>
