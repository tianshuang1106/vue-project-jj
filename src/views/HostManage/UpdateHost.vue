<template>
  <el-form ref="formRef" :model="formData" label-width="120px" class="demo-dynamic">
    <!-- 主机 -->
    <el-form-item label="主机ID" prop="uid">
      <el-input v-model="formData.uid" disabled clearable />
    </el-form-item>

    <!-- 目标游戏 -->
    <el-form-item
      label="目标游戏"
      prop="target_game_name"
      :rules="[
        {
          required: true,
          message: '请输入目标游戏',
          trigger: 'blur'
        }
      ]"
    >
      <el-input v-model="formData.target_game_name" placeholder="请输入目标游戏" learable />
    </el-form-item>

    <!-- ocr服务 -->
    <el-form-item
      label="ocr服务"
      prop="ocr_host_url"
      :rules="[
        {
          required: true,
          message: '请输入ocr服务地址',
          trigger: 'blur'
        }
      ]"
    >
      <el-input v-model="formData.ocr_host_url" placeholder="请输入ocr服务地址" learable />
    </el-form-item>

    <!-- 注册码 -->
    <el-form-item
      label="注册码"
      prop="code"
      :rules="[
        {
          required: true,
          message: '请输入注册码',
          trigger: 'blur'
        }
      ]"
    >
      <el-input v-model="formData.code" placeholder="请输入注册码" learable />
    </el-form-item>

    <!-- 注册附加码 -->
    <el-form-item
      label="注册附加码"
      prop="ver"
      :rules="[
        {
          required: true,
          message: '请输入注册附加码',
          trigger: 'blur'
        }
      ]"
    >
      <el-input v-model="formData.ver" placeholder="请输入注册附加码" learable />
    </el-form-item>

    <!-- 注册IP -->
    <el-form-item
      label="注册IP"
      prop="ip"
      :rules="[
        {
          required: true,
          message: '请输入注册IP',
          trigger: 'blur'
        }
      ]"
    >
      <el-input v-model="formData.ip" placeholder="请输入注册IP" learable />
    </el-form-item>

    <!-- 备注 -->
    <el-form-item label="备注" prop="des">
      <el-input v-model="formData.des" type="textarea" clearable />
    </el-form-item>
    <br />
    <el-form-item>
      <el-button size="small" type="primary" @click="saveData(formRef)"> <i class="fa fa-check"> </i> 确认修改 </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
// 使用defineEmits注册一个自定义事件
const emit = defineEmits(['action'])
const props = defineProps({
  current: {
    type: Object,
    required: true
  }
})

// 基础数据loading效果
const formRef = ref<FormInstance>()
let formData: any = reactive({
  ...props.current
})

// 保存数据
const saveData = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      delete formData.img
      emit('action', formData)
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<style scoped></style>
