<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <h3 style="margin: 0;">利润数据</h3>
      </div>
    </template>
    <el-row :gutter="20">
      <el-col :span="4">
        <h4>选项</h4>
        <el-divider />
        <h5>展示形式</h5>
        <el-switch v-model="options.isTable" active-text="表格" inactive-text="图表" />
        <h5>分类方式</h5>
        <el-switch v-model="options.isPlaceType" active-text="时间" inactive-text="类型" />
        <h5>图例</h5>
        <el-switch v-model="options.isFee" active-text="次数" inactive-text="费用" />
        <h5 v-show="!options.isTable">时间范围</h5>
        <el-date-picker v-if="!options.isTable" v-model="currentMonth" type="month" placeholder="选择月份" />
      </el-col>
      <el-col :span="20">
        <h4>详细信息</h4>
        <el-table v-if="options.isTable" :data="options.isPlaceType ? placeTable : timeTable" style="width: 100%" stripe>
          <el-table-column v-if="!options.isPlaceType" prop="month" label="月份" width="180" />
          <el-table-column v-else prop="placeType" label="去处类型" width="180" />
          <el-table-column v-if="options.isFee" label="费用">
            <template #default="scope">
              ￥{{ scope.row.total * 4 }}.00
            </template>
          </el-table-column>
          <el-table-column v-else prop="total" label="总数" />
        </el-table>
        <div ref="chartdom" v-show="!options.isTable" style="height: 100%; width: 100%"></div>
        <el-divider />
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import axios from 'axios';
import * as echarts from 'echarts';
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
const options = reactive({
  isTable: false,
  isPlaceType: false,
  isFee: false
})
const currentMonth = ref(null);
//当改变时，需要重新渲染表格
watch(currentMonth, (newVal) => {
  //修改横轴年月
  const months = getMonths(newVal);
  attr.xAxis[0].data = months;
  //重置内容
  const { time, data } = getData(table.value);
  attr.series.forEach((item, index) => {
    item.data = data[index].filter((subItem, subIndex) => {
      return months.includes(time[subIndex])
    })
  })
  chart.setOption(attr);
})

//#region 处理表格对象
const chartdom = ref(null);
let chart = null;
let attr = null;
const table = ref(null);
const timeTable = computed(() => {
  let newTable = [];
  table.value.forEach((rawItem) => {
    //把table中的所有元素插入到newTable中去
    let index = newTable.findIndex(newItem => newItem.month === rawItem.month);
    if (index === -1) {
      newTable.push(Object.assign({}, rawItem));
    }
    else {
      newTable[index].total += rawItem.total;
    }
  })
  return newTable;
})
const placeTable = computed(() => {
  let newTable = [];
  table.value.forEach((rawItem) => {
    //把table中的所有元素插入到newTable中去
    let index = newTable.findIndex(newItem => newItem.placeType === rawItem.placeType);
    if (index === -1) {
      newTable.push(Object.assign({}, rawItem)); //不能直接push，会改变ref的值
    }
    else {
      newTable[index].total += rawItem.total;
    }
  })
  return newTable;
})
//返回默认月份
const getPreviousMonths = () => {
  let now = new Date();
  let previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  let previousPreviousMonth = new Date(previousMonth.getFullYear(), previousMonth.getMonth() - 1, 1);

  return [`${previousPreviousMonth.getFullYear()}-${String(previousPreviousMonth.getMonth() + 1).padStart(2, '0')}`,
  `${previousMonth.getFullYear()}-${String(previousMonth.getMonth() + 1).padStart(2, '0')}`,
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`];
}

//用户设定月份
const getMonths = (now) => {
  let thisMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  let nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return [`${thisMonth.getFullYear()}-${String(thisMonth.getMonth() + 1).padStart(2, '0')}`,
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
  `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}`];
}

//将表格转换为图表
const getData = (msg) => {
  const places = [...new Set(msg.map(item => item.placeType))];
  const time = [...new Set(msg.map(item => item.month))].sort((a, b) => { return a - b });

  const data = Array.from({ length: places.length }, (_, i) =>
    Array.from({ length: time.length }, (_, j) => {
      const index = msg.findIndex(item => item.placeType === places[i] && item.month === time[j]);
      if (index == -1) {
        return 0;
      }
      return msg[index].total;
    })
  );

  return { places, time, data };
}
//#endregion

onMounted(() => {
  axios.get("http://localhost:3001/getdeal").then((res) => {
    if (res.data.status) {
      console.log(res.data.msg);
      ElMessage.error("服务器错误，请重试");
    }
    else {
      table.value = res.data.msg;
      chart = echarts.init(chartdom.value);
      const { places, time, data } = getData(res.data.msg);
      //找到当前月份和之前两个月的月份
      const months = getPreviousMonths();
      attr = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: places //统计全部属性
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: months //找到以当前月为基准的前两个月
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: data.map((item, index) => ({
          name: places[index],
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          //找到命中三个月份的条目
          data: item.filter((subItem, subIndex) => {
            return months.includes(time[subIndex])
          })
        }))
      };
      chart.setOption(attr);
    }
  }).catch((err) => {
    ElMessage.error("服务器错误，请重试");
  })
})
</script>

<style scoped>
.box-card {
  height: 99%;
  background-color: #ffffffaa;
}

.el-input {
  width: 200px;
}
</style>
