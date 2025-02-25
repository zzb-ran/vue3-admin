<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Breadcrumb from '@/components/Breadcrumb.vue'
import {
  Expand,
  Fold,
  User,
  ArrowDown,
  Moon,
  Sunny,
  Odometer,
  Document
} from '@element-plus/icons-vue'

// 检查是否为移动设备
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

const router = useRouter()
const route = useRoute()
const isCollapse = ref(isMobile)
const dropdownVisible = ref(false)
const isDark = ref(localStorage.getItem('theme') === 'dark')

// 生成菜单项的函数
const generateMenuItems = (routes) => {
  const menuItems = []
  routes.forEach(route => {
    if (route.children && route.path === '/') {
      route.children.forEach(child => {
        if (!child.meta?.hidden) {
          const menuItem = {
            path: child.path,
            title: child.meta?.title || child.name,
            icon: child.meta?.icon || Document,
            children: []
          }
          if (child.children) {
            menuItem.children = child.children
              .filter(subChild => !subChild.meta?.hidden)
              .map(subChild => ({
                path: `${child.path}/${subChild.path}`,
                title: subChild.meta?.title || subChild.name,
                icon: subChild.meta?.icon || Document
              }))
          }
          menuItems.push(menuItem)
        }
      })
    }
  })
  return menuItems
}

// 计算菜单项
const menuItems = computed(() => generateMenuItems(router.options.routes))

// 获取当前激活的菜单项
const activeMenu = computed(() => {
  // 如果路由meta中定义了activeMenu，则使用它
  if (route.meta.activeMenu) {
    return route.meta.activeMenu
  }
  // 对于详情页这样的路由，我们需要去掉参数部分
  const pathWithoutParams = route.path.replace(/\/:\w+/g, '')
  // 如果是子路由，且没有独立的菜单项，则激活父级菜单
  const matched = route.matched
  if (matched.length > 1) {
    const parent = matched[matched.length - 2]
    if (parent.meta?.activeMenu) {
      return parent.meta.activeMenu
    }
  }
  return pathWithoutParams
})

// 监听路由变化
watch(
  () => route.path,
  () => {
    // 路由变化时，菜单会自动更新高亮状态
    // 因为我们使用了计算属性activeMenu作为:default-active的值
    // 所以不需要额外的处理
  }
)

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  const html = document.documentElement
  if (isDark.value) {
    html.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    html.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// 初始化主题
if (isDark.value) {
  document.documentElement.classList.add('dark')
}

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
      <div class="logo">
        <img src="/src/assets/logo.svg" alt="Logo" />
        <span v-show="!isCollapse">后台管理系统</span>
      </div>
      <el-menu
        :collapse="isCollapse"
        :collapse-transition="false"
        :default-active="activeMenu"
        class="sidebar-menu"
        :background-color="isDark ? '#1a1a1a' : '#304156'"
        :text-color="isDark ? '#a6a6a6' : '#bfcbd9'"
        :active-text-color="isDark ? '#409EFF' : '#409EFF'"
        router
      >
        <template v-for="item in menuItems" :key="item.path">
          <el-sub-menu v-if="item.children && item.children.length" :index="item.path">
            <template #title>
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item 
              v-for="child in item.children" 
              :key="child.path"
              :index="child.path"
            >
              <el-icon><component :is="child.icon" /></el-icon>
              <template #title>{{ child.title }}</template>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="item.path">
            <el-icon><component :is="item.icon" /></el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="header-left">
          <el-icon
            class="toggle-button"
            @click="toggleSidebar"
          >
            <component :is="isCollapse ? Expand : Fold" />
          </el-icon>
        </div>
        <div class="header-right">
          <el-icon
            class="theme-toggle"
            @click="toggleTheme"
          >
            <component :is="isDark ? Sunny : Moon" />
          </el-icon>
          <el-dropdown @command="handleLogout">
            <span class="user-info">
              <el-avatar :size="32" :icon="User" />
              <span class="username">管理员</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主要内容区域 -->
      <el-main>
        <Breadcrumb />
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container {
  height: 100vh;
}

.sidebar {
  background-color: var(--el-menu-bg-color);
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background-color: var(--el-menu-bg-color);
  color: var(--el-menu-text-color);
  flex-shrink: 0;
}

.logo img {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.sidebar-menu {
  border: none;
  flex: 1;
  overflow-y: auto;
}

.sidebar-menu::-webkit-scrollbar {
  width: 6px;
}

.sidebar-menu::-webkit-scrollbar-thumb {
  background: var(--el-border-color-lighter);
  border-radius: 3px;
}

.sidebar-menu::-webkit-scrollbar-track {
  background: var(--el-menu-bg-color);
}

.header {
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.toggle-button,
.theme-toggle {
  font-size: 20px;
  cursor: pointer;
  color: var(--el-text-color-primary);
  margin-right: 16px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin: 0 8px;
  color: var(--el-text-color-primary);
}
</style>