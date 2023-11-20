<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-row>
      <el-col v-for="(item, index) in cardData" :key="index" :span="8" :offset="index > 0 ? 2 : 0">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px" v-for="(itemChild, chilIndex) in Object.keys(item)" :key="chilIndex">
            <template v-if="itemChild == 'img'">
              <img :src="item.img" class="image" />
            </template>
            <template v-else>
              <div class="bottom">
                <span>{{ labelObj[itemChild] }}</span>
                <span>{{ item[itemChild] }}</span>
              </div>
            </template>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getHostInfo } from '../../api/hostManage'
const labelObj = {
  time: '该图片的截取时间',
  uid: '该主机的唯一id',
  game_name: '游戏名称',
  ocr_host: 'ocr服务地址',
  kk_client_count: '已启动客户端数量',
  war3_client_count: '已进入游戏数量'
}

// 基础数据
let cardData: any = ref<string[]>([])

onMounted(() => {
  getAllHost()
})

const getAllHost = async () => {
  const res = await getHostInfo()
  cardData.value = res
  console.log('res', res)
}
</script>

<style scoped>
.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  display: block;
}
</style>
