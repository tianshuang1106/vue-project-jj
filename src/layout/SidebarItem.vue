<template>
  <div>
    <template v-if="theOnlyOneChild">
      <template v-if="!theOnlyOneChild?.meta?.title">
        <el-menu-item v-for="(item, index) in theOnlyOneChild.children" :index="item.path" :key="item.path" :is-first-level="false">
          <span>{{ item?.meta?.title }}</span>
        </el-menu-item>
      </template>
      <template v-else>
        <el-sub-menu :index="theOnlyOneChild.path">
          <template #title>
            <span v-if="theOnlyOneChild.meta && theOnlyOneChild.meta.title">{{ theOnlyOneChild?.meta?.title }}</span>
          </template>
          <template v-if="theOnlyOneChild.children">
            <el-menu-item v-for="child in theOnlyOneChild.children" :key="child.path" :index="child.path">{{ child?.meta?.title }}</el-menu-item>
          </template>
        </el-sub-menu>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  sider: {
    type: Object,
    required: true
  }
})

const showingChildNumber = computed(() => {
  if (props.sider.children) {
    const showingChildNumber = props.sider.children.filter((item) => {
      if (item.meta) {
        return false
      } else {
        return true
      }
    })

    return showingChildNumber.length
  }
})

const theOnlyOneChild = computed(() => {
  if (showingChildNumber.value > 1) {
    return null
  }
  if (props.sider.children) {
    for (const child of props.sider.children) {
      if (!child.meta) {
        return child
      }
    }
  }

  return { ...props.sider }
})
</script>

<style scoped></style>
