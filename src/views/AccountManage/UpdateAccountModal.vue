<template>
  <el-form ref="formRef" :model="formData" label-width="120px" class="demo-dynamic">
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
      <el-input v-model="formData.account" disabled placeholder="请输入账号" clearable />
    </el-form-item>

    <el-form-item
      label="状态"
      prop="pwd"
      :rules="[
        {
          required: true,
          message: '请选择状态',
          trigger: 'blur'
        }
      ]"
    >
      <el-select v-model="formData.state" placeholder="请选择状态">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
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
      <el-input v-model="formData.pwd" placeholder="设置密码" />
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
  },
  options: {
    type: Object,
    required: true
  }
})
const formRef = ref<FormInstance>()
let formData: any = reactive(props.current)

const saveData = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      emit('action', formData)
    } else {
      console.log('error submit!')
      return false
    }
  })
}

</script>

<style scoped></style>
