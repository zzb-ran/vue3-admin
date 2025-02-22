<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { HomeFilled } from '@element-plus/icons-vue'

const route = useRoute()

// 计算面包屑数据
const breadcrumbs = computed(() => {
  // 过滤掉没有 meta.title 的路由
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  
  // 生成面包屑数据
  return matched.map(item => ({
    title: item.meta.title,
    path: item.meta.activeMenu || item.path,
    icon: item.meta.icon
  }))
})
</script>

<template>
  <el-breadcrumb separator="/" class="breadcrumb">
    <el-breadcrumb-item :to="{ path: '/dashboard' }">
      <el-icon><home-filled /></el-icon>
      <span style="margin-left: 4px">首页</span>
    </el-breadcrumb-item>
    <el-breadcrumb-item 
      v-for="item in breadcrumbs" 
      :key="item.path"
      :to="{ path: item.path }"
    >
      <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
      <span :style="{ marginLeft: item.icon ? '4px' : '0' }">{{ item.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped>
.breadcrumb {
  margin: 16px 0;
  padding: 0 16px;
}

:deep(.el-breadcrumb__item) {
  .el-breadcrumb__inner {
    display: flex;
    align-items: center;
  }
}
</style>