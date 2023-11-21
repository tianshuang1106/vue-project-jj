<template>
    <div class="wrapper">
      <el-card class="transfer"> 确认要新创建一个主机吗？ </el-card>
      <br />
      <el-row class="btns">
        <el-button size="small" type="primary" @click="create"> <i class="fa fa-check"> </i> 确认创建 </el-button>
      </el-row>
    </div>
  </template>
  
  <script setup lang="ts">
  // 使用defineEmits注册一个自定义事件
  const emit = defineEmits(['action'])
  const create = () => {
    emit('action')
  }
  </script>
  
  <style scoped></style>
  