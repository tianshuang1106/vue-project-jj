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
      <el-row v-loading="loading">
        <el-col class="statistic-box" :span="6" v-for="(item, index) in Object.keys(cardData)" :key="index">
          <el-card class="box-card" style="margin-bottom: 20px">
            <el-descriptions :title="baseAccountTitleList[item] ? baseAccountTitleList[item] : `${item}添加的数量`">
              <el-descriptions-item>{{ cardData[item] }}</el-descriptions-item>
              <el-descriptions-item><el-button size="small" @click="downAccount(item)">下载到本地</el-button></el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <!-- 账号查找 -->
    <el-card class="box-card">
      <template #header>
        <div class="card-form">
          <Row>
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item label="账号">
                <el-input v-model="formInline.account" placeholder="请输入要查询的账号" clearable />
              </el-form-item>

              <el-form-item label="按时间查询">
                <el-date-picker v-model="formInline.date" type="date" placeholder="请选择要查询的时间" clearable />
              </el-form-item>

              <el-form-item label="按账号状态查询">
                <el-select v-model="formInline.state" placeholder="请选择要查询的账号状态" clearable>
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-form>
          </Row>

          <Row>
            <el-button type="primary" @click="getAccountDetail">查找</el-button>
            <el-button type="primary" @click="btnClick(1)">添加</el-button>
          </Row>
        </div>
      </template>

      <el-table v-loading="infoLoading" :border="true" :data="dataSource" style="width: 100%">
        <el-table-column fixed prop="create_date" label="创建时间" />
        <el-table-column prop="account" label="账号" />
        <el-table-column prop="pwd" label="密码" />
        <el-table-column prop="error" label="当前状态">
          <template #default="{ row }">
            <span>{{ titleList[row.state] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="use_date" label="活跃时间" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="btnClick(2, scope.row)">修改</el-button>
            <el-button link type="primary" size="small" @click="btnClick(3, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </el-scrollbar>

  <!-- 账号操作对话框 -->
  <el-dialog v-model="dialogVisible" center :title="title" @close="dialogClose" close-on-click-modal>
    <component ref="dialogMethods" @action="action" :accountInfo="currentAccount" :options="options" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { getBaseInfo, getAccountInfo, addAccount, updateAccount, delAccount } from '../../api/accountManage'
import AddAccountModal from './AddAccountModal.vue'
import UpdateAccountModal from './UpdateAccountModal.vue'
import DeleteAccountModal from './DeleteAccountModal.vue'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import { downloadCsv } from '../../utils/downloadCsv'

// 账号状态展示相关信息
const titleList = {
  0: '空闲中',
  1: '使用中',
  2: '密码错误',
  3: '账号封禁',
  4: '需要手机验证',
  5: '其他异常'
}

// 基础账号数据展示相关信息
const baseAccountTitleList = {
  ...titleList,
  all: '所有数据'
}

// 基础数据
let cardData: any = ref<string[]>([])
// 表格数据
let dataSource = ref<any>(null)
// 基础数据loading效果
const loading = ref(true)
// 账号查询结果loading效果
const infoLoading = ref(false)
// 对话框操作类型
const operateType = ref<number>(1)
// 对话框展示隐藏状态
const dialogVisible = ref(false)
// 对话框相关信息的列表
const dialogTitleList = [
  {
    operateType: 1,
    title: '新增账号',
    component: AddAccountModal,
    method: addAccount
  },
  {
    operateType: 2,
    title: '修改账号',
    component: UpdateAccountModal,
    method: updateAccount
  },
  {
    operateType: 3,
    title: '删除账号',
    component: DeleteAccountModal,
    method: delAccount
  }
]
// 下拉选项
const options = Object.keys(titleList).map((item) => {
  return { value: item, label: titleList[item] }
})
// 匹配方法
const match = (matchKey: any, operateType: number) => {
  let a: any = dialogTitleList.find((item) => item['operateType'] == operateType)
  return a[matchKey]
}
// 对话框标题
let title = ref<string>(match('title', operateType.value))
// 要操作的组件
let component = ref<any>(match('component', operateType.value))
// 选中的当前账户信息
let currentAccount = ref<any | null>(null)

// 搜索表单项
const formInline: any = reactive({
  account: '',
  date: '',
  state: ''
})

// 基础数据查询
const getBaseDate = async () => {
  try {
    const data: any = await getBaseInfo()
    let newData: any = {}
    Object.keys(data).forEach((item) => {
      if (baseAccountTitleList[item]) {
        newData[item] = data[item]
      } else {
        newData[moment(newData[item]).format('YYYY-MM-DD')] = data[item]
      }
    })
    cardData.value = newData ? newData : {}
  } catch (error) {}
  loading.value = false
}

// 账号查询数据
const getAccountDetail = async () => {
  infoLoading.value = true
  const params = cloneDeep(formInline)
  try {
    params.date = params.date ? params.date.valueOf() / 1000 : ''
    const { tableData, total }: any = await getAccountInfo(params)
    dataSource.value = total > 0 ? tableData : []
  } catch (error) {}
  infoLoading.value = false
}
onMounted(() => {
  getBaseDate()
  getAccountDetail()
})

// 增改改btn
const btnClick = (type: number, row?: any) => {
  title.value = match('title', type)
  component.value = match('component', type)
  operateType.value = type
  currentAccount.value = row ? row : null
  dialogVisible.value = true
}
// 接口请求
const action = async (formData: any) => {
  const method = match('method', operateType.value)
  await method(formData)
  ElMessage.success(`${title.value}成功`)
  dialogVisible.value = false
  getAccountDetail()
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

const dialogMethods: any = ref(null)
// 关闭对话框
const dialogClose = () => {
  dialogMethods.value.clearForm && dialogMethods.value.clearForm()
}
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

.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.el-scrollbar {
  height: 100%;
}
</style>
