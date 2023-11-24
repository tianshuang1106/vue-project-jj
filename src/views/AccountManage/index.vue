<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <!-- 账号查找 -->
    <el-card class="box-card">
      <template #header>
        <div class="card-form">
          <el-row>
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
          </el-row>

          <el-row>
            <el-button type="primary" @click="getAccountDetail">查找</el-button>
            <el-button type="primary" @click="btnClick(1)">添加</el-button>
          </el-row>
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
  <el-dialog v-model="dialogVisible" center :title="title" :destroy-on-close="true" close-on-click-modal>
    <component @action="action" :options="options" :current="currentAccount" :content="content" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, markRaw } from 'vue'
import { getAccountInfo, addAccount, updateAccount, delAccount } from '../../api/accountManage'
import AddAccountModal from './AddAccountModal.vue'
import UpdateAccountModal from './UpdateAccountModal.vue'
import Confirm from '../../components/Confirm/index.vue'
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash'

// 账号状态展示相关信息
const titleList = {
  0: '空闲中',
  1: '使用中',
  2: '密码错误',
  3: '账号封禁',
  4: '需要手机验证',
  5: '其他异常'
}

// 匹配方法
const match = (matchKey: any, operateType: number) => {
  let a: any = dialogTitleList.find((item) => item['operateType'] == operateType)
  return a[matchKey] ? a[matchKey] : ''
}

// 对话框相关信息的列表
const dialogTitleList = [
  {
    operateType: 1,
    title: '新增账号',
    component: markRaw(AddAccountModal),
    method: addAccount
  },
  {
    operateType: 2,
    title: '修改账号',
    component: markRaw(UpdateAccountModal),
    method: updateAccount
  },
  {
    operateType: 3,
    title: '删除账号',
    component: markRaw(Confirm),
    method: (formData: any) => delCurrent(formData)
  }
]
// 表格数据
let dataSource = ref<any>(null)
// 账号查询结果loading效果
const infoLoading = ref(false)
// 对话框操作类型
const operateType = ref<number>(1)
// 对话框展示隐藏状态
const dialogVisible = ref<boolean>(false)
// 对话框标题
let title = ref<string>(match('title', operateType.value))
// 要操作的组件
let component = ref<any>(match('component', operateType.value))
// 选中的当前账户信息
let currentAccount = ref<any | null>(null)
// 下拉选项
const options = Object.keys(titleList).map((item) => {
  return { value: item, label: titleList[item] }
})
// 要展示的信息
let content = ref<any>('')

// 搜索表单项
const formInline: any = reactive({
  account: '',
  date: '',
  state: ''
})

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
  getAccountDetail()
})

// 增改改btn
const btnClick = (type: number, row?: any) => {
  title.value = match('title', type)
  content.value = row ? `确认${match('title', type)}${row.account}相关账号的信息？` : ''
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

const delCurrent = async (formData: any) => {
  const { account } = formData
  await delAccount(account)
}
</script>

<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.el-scrollbar {
  height: 100%;
}
</style>
