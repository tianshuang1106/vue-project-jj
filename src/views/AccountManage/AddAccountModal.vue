<template>
  <div v-loading="loading" class="wrapper">
    <el-form ref="formRef" :model="formDate" label-width="120px" class="demo-dynamic">
      <el-form-item
        label="账号"
        prop="account"
        :rules="[
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          }
        ]"
      >
        <el-input v-model="formDate.account" placeholder="请输入账号" clearable />
      </el-form-item>

      <el-form-item
        label="密码"
        prop="pwd"
        :rules="[
          {
            required: true,
            message: '请设置密码',
            trigger: 'blur'
          }
        ]"
      >
        <el-input v-model="formDate.pwd" placeholder="设置密码" clearable />
      </el-form-item>
      <br />
      <el-form-item>
        <el-button size="mini" type="primary" @click="saveData(formRef)"> <i class="fa fa-check"> </i> 确认新增 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
// 使用defineEmits注册一个自定义事件
const emit = defineEmits(['action'])

const formRef = ref<FormInstance>()
const loading = ref(false)
const formDate = reactive({
  account: '',
  pwd: ''
})

const saveData = (formEl: FormInstance | undefined) => {
  loading.value = true
  if (!formEl) return
  formEl.validate((valid) => {
    loading.value = false
    if (valid) {
      emit('action', formDate)
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<style scoped></style>
