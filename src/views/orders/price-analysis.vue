<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

// 价格统计数据
const priceStats = ref({
  totalOrders: 156,
  totalAmount: 45678.90,
  averageAmount: 292.81,
  monthlyStats: [
    { month: '2024-01', amount: 15678.90, count: 52 },
    { month: '2024-02', amount: 14567.80, count: 48 },
    { month: '2024-03', amount: 15432.20, count: 56 }
  ],
  priceRanges: [
    { range: '0-100', count: 45 },
    { range: '101-300', count: 68 },
    { range: '301-500', count: 25 },
    { range: '501+', count: 18 }
  ]
})

// 初始化图表
const initCharts = () => {
  // 月度趋势图
  const trendChart = echarts.init(document.getElementById('trendChart'))
  const trendOption = {
    title: { text: '月度订单金额趋势' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: priceStats.value.monthlyStats.map(item => item.month)
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '订单金额',
        type: 'line',
        data: priceStats.value.monthlyStats.map(item => item.amount),
        smooth: true
      }
    ]
  }
  trendChart.setOption(trendOption)

  // 价格区间分布图
  const distributionChart = echarts.init(document.getElementById('distributionChart'))
  const distributionOption = {
    title: { text: '订单价格区间分布' },
    tooltip: { trigger: 'item' },
    series: [
      {
        name: '价格区间',
        type: 'pie',
        radius: '60%',
        data: priceStats.value.priceRanges.map(item => ({
          name: item.range,
          value: item.count
        }))
      }
    ]
  }
  distributionChart.setOption(distributionOption)
}

onMounted(() => {
  initCharts()
})
</script>

<template>
  <div class="price-analysis-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总订单数</span>
            </div>
          </template>
          <div class="card-value">{{ priceStats.totalOrders }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总金额</span>
            </div>
          </template>
          <div class="card-value">¥{{ priceStats.totalAmount.toFixed(2) }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>平均订单金额</span>
            </div>
          </template>
          <div class="card-value">¥{{ priceStats.averageAmount.toFixed(2) }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-container">
      <el-col :span="16">
        <el-card class="chart-card">
          <div id="trendChart" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <div id="distributionChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 月度数据表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>月度订单统计</span>
        </div>
      </template>
      <el-table :data="priceStats.monthlyStats" border style="width: 100%">
        <el-table-column prop="month" label="月份" />
        <el-table-column prop="count" label="订单数" />
        <el-table-column prop="amount" label="订单金额">
          <template #default="{ row }">
            ¥{{ row.amount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="平均订单金额">
          <template #default="{ row }">
            ¥{{ (row.amount / row.count).toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.price-analysis-container {
  padding: 20px;
}

.stats-cards {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  text-align: center;
}

.charts-container {
  margin-bottom: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.chart {
  height: 400px;
  width: 100%;
}

.table-card {
  margin-bottom: 20px;
}
</style>