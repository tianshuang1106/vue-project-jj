<template>
  <el-tooltip :visible="visible">
    <template #content>
      <span>{{ content }}</span>
    </template>
    <span @mouseenter="visible = true" @mouseleave="visible = false">{{ showTooltip ? content.slice(0, 24).concat('..') : content }}</span>
  </el-tooltip>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

const showTooltip = props.content.length > 25
const visible = ref(false)
</script>

<style scoped></style>
