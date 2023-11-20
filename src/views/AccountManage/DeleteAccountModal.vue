<template>
  <div class="wrapper">
    <el-card class="transfer"> 确认删除账号为{{ accountInfo.account }}的信息？ </el-card>
    <br />
    <el-row class="btns">
      <el-button size="mini" type="primary" @click="saveData"> <i class="fa fa-check"> </i> 确认删除 </el-button>
    </el-row>
  </div>
</template>

<script setup lang="ts">
// 使用defineEmits注册一个自定义事件
const emit = defineEmits(['action'])
const props = defineProps({
  accountInfo: {
    type: Object,
    required: true
  }
})
const saveData = () => {
  emit('action', props.accountInfo.account)
}
</script>

<style scoped></style>
