<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

// 检测暗色主题
const isDark = ref(document.documentElement.classList.contains('dark'))

// 监听主题变化
const observer = new MutationObserver(() => {
  isDark.value = document.documentElement.classList.contains('dark')
  if (visitChart && userChart) {
    // 重新初始化图表以应用新主题
    visitChart.dispose()
    userChart.dispose()
    initCharts()
  }
})

// 模拟的统计数据
const stats = ref({
  totalUsers: 2459,
  activeUsers: 891,
  totalOrders: 6782,
  revenue: '289,450'
})

// 图表实例
let visitChart = null
let userChart = null

// 初始化图表
const initCharts = async () => {
  await nextTick()
  
  // 获取当前主题的背景色
  const computedStyle = getComputedStyle(document.documentElement)
  const bgColor = computedStyle.getPropertyValue('--el-bg-color')
  
  // 访问量趋势图表
  visitChart = echarts.init(document.getElementById('visitChart'), isDark.value ? 'dark' : null)
  visitChart.setOption({
    backgroundColor: bgColor,
    title: {
      text: '访问量趋势'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true,
      itemStyle: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--el-color-primary')
      },
      lineStyle: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--el-color-primary')
      }
    }]
  })

  // 用户分布饼图
  userChart = echarts.init(document.getElementById('userChart'), isDark.value ? 'dark' : null)
  userChart.setOption({
    backgroundColor: bgColor,
    title: {
      text: '用户分布'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [{
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: '华东' },
        { value: 735, name: '华北' },
        { value: 580, name: '华南' },
        { value: 484, name: '西北' },
        { value: 300, name: '西南' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      itemStyle: {
        color: function(params) {
          const colors = [
            getComputedStyle(document.documentElement).getPropertyValue('--el-color-primary'),
            getComputedStyle(document.documentElement).getPropertyValue('--el-color-primary-light-3'),
            getComputedStyle(document.documentElement).getPropertyValue('--el-color-primary-light-5'),
            getComputedStyle(document.documentElement).getPropertyValue('--el-color-primary-light-7'),
            getComputedStyle(document.documentElement).getPropertyValue('--el-color-primary-light-9')
          ]
          return colors[params.dataIndex]
        }
      }
    }]
  })
}

// 组件挂载后初始化图表
onMounted(async () => {
  await initCharts()
  
  // 监听窗口大小变化，调整图表大小
  window.addEventListener('resize', () => {
    if (visitChart && userChart) {
      visitChart.resize()
      userChart.resize()
    }
  })

  // 开始观察主题变化
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
})

// 组件卸载前清理
onBeforeUnmount(() => {
  // 停止观察主题变化
  observer.disconnect()
  
  // 移除resize事件监听
  window.removeEventListener('resize', () => {
    if (visitChart && userChart) {
      visitChart.resize()
      userChart.resize()
    }
  })

  // 销毁图表实例
  if (visitChart) {
    visitChart.dispose()
    visitChart = null
  }
  if (userChart) {
    userChart.dispose()
    userChart = null
  }
})
</script>

<template>
  <div class="dashboard-container">
    <div class="stats-cards">
      <el-card class="stats-card">
        <template #header>
          <div class="card-header">
            <span>总用户数</span>
          </div>
        </template>
        <div class="card-value">{{ stats.totalUsers }}</div>
      </el-card>

      <el-card class="stats-card">
        <template #header>
          <div class="card-header">
            <span>活跃用户</span>
          </div>
        </template>
        <div class="card-value">{{ stats.activeUsers }}</div>
      </el-card>

      <el-card class="stats-card">
        <template #header>
          <div class="card-header">
            <span>总订单数</span>
          </div>
        </template>
        <div class="card-value">{{ stats.totalOrders }}</div>
      </el-card>

      <el-card class="stats-card">
        <template #header>
          <div class="card-header">
            <span>总收入</span>
          </div>
        </template>
        <div class="card-value">¥{{ stats.revenue }}</div>
      </el-card>
    </div>

    <div class="charts">
      <el-card class="chart-card">
        <div id="visitChart" class="chart"></div>
      </el-card>

      <el-card class="chart-card">
        <div id="userChart" class="chart"></div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stats-card {
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
}

.card-header {
  color: var(--el-text-color-regular);
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--el-text-color-primary);
  text-align: center;
  margin-top: 10px;
}

.charts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.chart-card {
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
}

.chart {
  height: 400px;
}

@media (max-width: 1200px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-cards,
  .charts {
    grid-template-columns: 1fr;
  }
}
</style>