<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>主机信息</span>
          <div>
            <el-button @click="getAllHost">刷新主机</el-button>
            <el-button @click="btnClick(1)">创建主机</el-button>
          </div>
        </div>
      </template>

      <el-row v-loading="loading">
        <el-col class="statistic-box statistic-box-margin" :span="7" v-for="(item, index) in cardData" :key="index">
          <el-card class="box-card" style="margin-bottom: 20px">
            <template #header>
              <div class="card-header">
                <span>主机Id: {{ item.uid }}</span>
                <el-button @click="btnClick(2, item.uid)">修改</el-button>
              </div>
            </template>

            <div v-for="(itemChild, chilIndex) in Object.keys(item)" :key="chilIndex">
              <el-image
                v-if="itemChild == 'img' && item[itemChild]"
                :src="`data:image/png;base64,${item[itemChild]}`"
                fit="contain"
                class="image"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="[`data:image/png;base64,${item[itemChild]}`]"
                :initial-index="4"
              />

              <el-image v-if="itemChild == 'img' && !item[itemChild]">
                <template #error>
                  <div class="image-slot">
                    <el-icon><icon-picture /></el-icon>
                  </div>
                </template>
              </el-image>

              <div v-if="itemChild != 'img' && labelObj[itemChild]" class="card-header labelStyle">
                <span>{{ labelObj[itemChild] }}</span>
                <Description :content="item[itemChild] ? item[itemChild] : '暂无数据'" />
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </el-scrollbar>

  <!-- 对话框 -->
  <el-dialog v-model="dialogVisible" center :title="title" :destroy-on-close="true" close-on-click-modal>
    <component @action="action" :currentHost="currentHost" />
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, markRaw } from 'vue'
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { getHostInfo, addHost, updateHost, getCurrentHost } from '../../api/hostManage'
import Description from '../../components/Description/index.vue'
import AddHost from './AddHost.vue'
import UpdateHost from './UpdateHost.vue'
import { ElMessage } from 'element-plus'

const labelObj = {
  img_date: '该图片的截取时间',
  client_count: '已登录平台数量',
  war3_count: '已进入游戏数量',
  target_game_name: '目标游戏',
  ocr_host_url: 'ocr服务地址',
  code: '注册码',
  ver: '注册附加码',
  ip: '注册IP',
  des: '备注'
}
// 对话框相关信息的列表
const dialogTitleList = [
  {
    operateType: 1,
    title: '创建主机',
    component: markRaw(AddHost),
    method: addHost
  },
  {
    operateType: 2,
    title: '修改主机',
    component: markRaw(UpdateHost),
    method: updateHost,
    otherAction: (uid: string) => getCurrentHostInfo(uid)
  }
]
// 匹配方法
const match = (matchKey: any, operateType: number) => {
  let a: any = dialogTitleList.find((item) => item['operateType'] == operateType)
  return a[matchKey]
}
// 对话框操作类型
const operateType = ref<number>(1)
// 对话框展示隐藏状态
const dialogVisible = ref<boolean>(false)
// 对话框标题
let title = ref<string>(match('title', operateType.value))
// 要操作的组件
let component = ref<any>(match('component', operateType.value))
// 选中的当前主机信息
let currentHost = ref<object>({})

// 基础数据loading效果
const loading = ref(false)
// 基础数据
let cardData: any = ref<string[]>([])

onMounted(() => {
  getAllHost()
})

// 全部主机信息获取
const getAllHost = async () => {
  loading.value = true
  try {
    const { tableData, total }: any = await getHostInfo()
    let dataSource = Object.keys(tableData).map((item) => tableData[item])
    cardData.value = total > 0 ? dataSource : []
  } catch (error) {}
  loading.value = false
}

// 获取单个主机信息
const getCurrentHostInfo = async (uid: string) => {
  let res = await getCurrentHost(uid)
  currentHost.value = res ? res : {}
}

// 接口请求
const action = async (formData: any) => {
  const method = match('method', operateType.value)
  await method(formData)
  ElMessage.success(`${title.value}成功`)
  dialogVisible.value = false
  getAllHost()
}

// 增改改btn
const btnClick = async (type: number, uid?: string) => {
  title.value = match('title', type)
  component.value = match('component', type)
  operateType.value = type
  const otherAction = match('otherAction', type)
  otherAction && await otherAction(uid)
  dialogVisible.value = true
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.labelStyle {
  padding: 5px;
}

.statistic-box-margin {
  margin-left: 10px;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.image {
  width: 100%;
  display: block;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}
.image-slot .el-icon {
  font-size: 30px;
}
</style>
