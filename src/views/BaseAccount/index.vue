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
        <el-col class="statistic-box" :span="10" v-for="(item, index) in Object.keys(card)" :key="index">
          <el-card class="box-card" style="margin-bottom: 20px">
            <el-descriptions :title="baseAccountTitleList[item] ? baseAccountTitleList[item] : `${item}添加的数量`">
              <el-descriptions-item>{{ card[item] }}</el-descriptions-item>
            </el-descriptions>

            <div>
              <el-button size="small" v-for="(operator, operatorIndex) in operatorList" :key="operatorIndex" @click="btnClick(operatorIndex, item)">{{ operator.title }}</el-button>
              <!-- <el-button size="small" @click="downAccount(item)">下载到本地</el-button>
              <el-button size="small" @click="resetAccount(item)">重置状态</el-button>
              <el-button size="small" @click="batchDeleteAccount(item)">批量删除</el-button> -->
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </el-scrollbar>

  <!-- 账号操作对话框 -->
  <el-dialog v-if="component && dialogVisible" v-model="dialogVisible" center :title="title" :destroy-on-close="true" close-on-click-modal>
    <component @action="action" :current="currentAccount" :content="content" />
  </el-dialog>
</template>

<script setup lang="ts">
import moment from 'moment'
import { downloadCsv } from '../../utils/downloadCsv'
import { onMounted, ref, markRaw } from 'vue'
import { getBaseInfo, getAccountInfo, batchDelAccount, batchResetAccount } from '../../api/accountManage'
import Confirm from '../../components/Confirm/index.vue'
import { ElMessage } from 'element-plus'

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

// 选中的当前账户信息
let currentAccount = ref<any | null>(null)
// 操作相关的列表
const operatorList = [
  {
    operateType: 0,
    title: '下载到本地',
    otherAction: () => downAccount()
  },
  {
    operateType: 1,
    title: '重置状态',
    component: markRaw(Confirm),
    method: batchResetAccount
  },
  {
    operateType: 2,
    title: '批量删除',
    component: markRaw(Confirm),
    method: batchDelAccount
  }
]
// 匹配方法
const match = (matchKey: any, operateType: number) => {
  let a: any = operatorList.find((item) => item['operateType'] == operateType)
  return a[matchKey] ? a[matchKey] : ''
}
// 对话框操作类型
const operateType = ref<number>(1)
// 对话框展示隐藏状态
const dialogVisible = ref<boolean>(false)
// 对话框标题
let title = ref<string>(match('title', operateType.value))
// 要操作的组件
let component = ref<any>(match('component', operateType.value))
// 要展示的信息
let content = ref<any>('')
// 请求参数
let params = ref<any | null>(null)

// 按钮操作
const btnClick = async (type: number, state: any) => {
  const isCurrent = baseAccountTitleList[state]
  operateType.value = type
  title.value = match('title', type)
  content.value = `确认${match('title', type)}${isCurrent ? isCurrent : state}相关账号的信息？`
  component.value = match('component', type)
  let params
  // 组合请求参数
  if (isCurrent) {
    params = { state }
  } else {
    const date = moment(state).format('X')
    params = { date }
  }
  currentAccount.value = params
  const otherAction = match('otherAction', type)
  otherAction && (await otherAction())
  dialogVisible.value = true
}

// 接口请求
const action = async (formData: any) => {
  const method = match('method', operateType.value)
  await method(formData)
  ElMessage.success(`${title.value}成功`)
  dialogVisible.value = false
  getBaseDate()
}

// 基础数据查询
const getBaseDate = async () => {
  try {
    const data: any = await getBaseInfo()

    const dataSource = data.map((dataItem: any) => {
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
const downAccount = async () => {
  const { tableData = [], total }: any = await getAccountInfo(currentAccount.value)
  const title = baseAccountTitleList[currentAccount.value.state] ? baseAccountTitleList[currentAccount.value.state] : currentAccount.value.date
  let rows: any[] = []
  let head = ['账号', '创建时间', '状态', '密码', '活跃时间']

  if (total > 0) {
    tableData.forEach((item: any) => {
      // 状态
      const state = baseAccountTitleList[item.state]
      let row = [item.account, item.create_date, state, item.pwd, item.use_date]
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
