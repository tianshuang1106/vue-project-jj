<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'

import { constantRoutes } from '../router'

import SidebarItem from './SidebarItem.vue'

const router = useRouter()
const defaultActive = router.currentRoute.value.path
</script>

<template>
  <el-container class="layout-container-demo" style="height: 100vh;">
    <el-aside width="200px">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu :router="true" :default-active="defaultActive" background-color="#545c64" text-color="#fff">
          <SidebarItem v-for="(item, index) in constantRoutes" :key="item.path" :index="item.path" :sider="item" />
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container-demo .el-aside {
  height: 100vh;
  background-color: #545c64;
}
.layout-container-demo .el-container > {
  height: 100vh;
}

.el-scrollbar {
  height: 100%;
}

</style>
