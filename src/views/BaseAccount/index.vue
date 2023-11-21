<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <!-- 基础信息 -->
    <el-card class="box-card" style="margin-bottom: 20px">
      <template #header>
        <div class="card-header">
          <span>账号基础信息</span>
          <el-button class="button" @click="getBaseDate">点击刷新</el-button>
        </div>
      </template>
      <el-row v-loading="loading" v-for="(card, cardIndex) in cardData" :index="cardIndex">
        <el-col class="statistic-box" :span="6" v-for="(item, index) in Object.keys(card)" :key="index">
          <el-card class="box-card" style="margin-bottom: 20px">
            <el-descriptions :title="baseAccountTitleList[item] ? baseAccountTitleList[item] : `${item}添加的数量`">
              <el-descriptions-item>{{ card[item] }}</el-descriptions-item>
              <el-descriptions-item><el-button size="small" @click="downAccount(item)">下载到本地</el-button></el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </el-scrollbar>
</template>

<script setup lang="ts">
import moment from 'moment'
import { downloadCsv } from '../../utils/downloadCsv'
import { onMounted, ref } from 'vue'
import { getBaseInfo, getAccountInfo } from '../../api/accountManage'

// 基础账号数据展示相关信息
const baseAccountTitleList = {
  0: '空闲中',
  1: '使用中',
  2: '密码错误',
  3: '账号封禁',
  4: '需要手机验证',
  5: '其他异常',
  all: '所有数据'
}
// 基础数据
let cardData: any = ref<string[]>([])
// 基础数据loading效果
const loading = ref(true)

// 基础数据查询
const getBaseDate = async () => {
  try {
    const data: any = await getBaseInfo()

    const dataSource = data.map((dataItem) => {
      let newData: any = {}
      Object.keys(dataItem).forEach((item: any) => {
        if (baseAccountTitleList[item]) {
          newData[item] = dataItem[item]
        } else {
          newData[moment(item * 1000).format('YYYY-MM-DD')] = dataItem[item]
        }
      })
      return newData
    })
    cardData.value = dataSource
  } catch (error) {}
  loading.value = false
}

// 下载功能
const downAccount = async (state: string) => {
  const params: any = {
    state: baseAccountTitleList[state] ? state : new Date(state).valueOf() / 1000
  }
  const { tableData = [], total }: any = await getAccountInfo(params)
  const title = baseAccountTitleList[state] ? baseAccountTitleList[state] : state
  let rows: any[] = []
  let head = ['账号', '创建时间', '状态', '密码']

  if (total > 0) {
    tableData.forEach((item: any) => {
      // 状态
      const state = baseAccountTitleList[item.state]
      let row = [item.account, item.create_date, state, item.pwd]
      rows.push(row)
    })
  }
  downloadCsv(rows, head, `${title}汇总${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}`)
}

onMounted(() => {
  getBaseDate()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-box {
  padding: 10px 20px;
}

.card-form {
  display: flex;
  justify-content: center;
}

.el-scrollbar {
  height: 100%;
}
</style>
