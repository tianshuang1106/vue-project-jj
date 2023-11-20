<template>
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
        <el-input v-model="formDate.account" disabled placeholder="请输入账号" clearable />
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
        <el-select v-model="formDate.state" placeholder="设置密码" clearable>
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <br />
      <el-form-item>
        <el-button size="mini" type="primary" @click="saveData(formRef)"> <i class="fa fa-check"> </i> 确认新增 </el-button>
      </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
// 使用defineEmits注册一个自定义事件
const emit = defineEmits(['action'])
const props = defineProps({
  accountInfo: {
    type: Object,
    required: true
  },
  titleList: {
    type: Array,
    required: true
  }
})
const formRef = ref<FormInstance>()
const formDate = reactive(props.accountInfo)
const options = [
  { value: 1, label: '接口正常' },
  { value: 2, label: '账号数量' },
  { value: 3, label: '使用中' },
  { value: 4, label: '密码错误' },
  { value: 5, label: '账号封禁' },
  { value: 6, label: '需要手机验证' },
  { value: 7, label: '其他异常' }
]
// const options = computed(() => {
//   const keys = Object.keys(props.titleList)
//   const list = keys.map((key) => {
//     return { value: props.titleList[key], label: key }
//   })
//   return list
// })

const saveData = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
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
