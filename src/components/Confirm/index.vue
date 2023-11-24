<template>
  <div class="wrapper">
    <el-card class="transfer">{{ content }} </el-card>
    <br />
    <el-row class="btns">
      <el-button size="small" type="primary" @click="saveData"> <i class="fa fa-check"> </i> 确认 </el-button>
    </el-row>
  </div>
</template>

<script setup lang="ts">
// 使用defineEmits注册一个自定义事件
const emit = defineEmits(['action'])
const props = defineProps({
  current: {
    type: Object,
    required: true
  },
  content: {
    type: String,
    required: true
  }
})
const saveData = () => {
  emit('action', props.current)
}
</script>

<style scoped></style>
