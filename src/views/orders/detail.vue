<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const orderId = route.params.id

// 返回订单列表
const goBack = () => {
  router.push('/orders/orders-list')
}

// 模拟订单数据
const orderList = [
  {
    id: '1',
    customer: '张三',
    amount: 1999.00,
    status: 'completed',
    createTime: '2024-03-08 10:23:45',
    paymentInfo: {
      method: '支付宝',
      payTime: '2024-03-08 10:25:30',
      transactionId: '2024030801456789'
    },
    items: [
      {
        id: 1,
        name: '商品A',
        price: 1999.00,
        quantity: 1,
        subtotal: 1999.00
      }
    ],
    address: {
      name: '张三',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园路1号'
    },
    logistics: {
      company: '顺丰快递',
      trackingNumber: 'SF1234567890',
      status: '已签收',
      timeline: [
        { time: '2024-03-08 16:30:00', status: '已签收' },
        { time: '2024-03-08 14:20:00', status: '派送中' },
        { time: '2024-03-08 10:30:00', status: '已发货' }
      ]
    }
  },
  {
    id: '2',
    customer: '李四',
    amount: 2999.00,
    status: 'shipped',
    createTime: '2024-03-08 11:23:45',
    paymentInfo: {
      method: '微信支付',
      payTime: '2024-03-08 11:25:30',
      transactionId: '2024030802456789'
    },
    items: [
      {
        id: 1,
        name: '商品B',
        price: 2999.00,
        quantity: 1,
        subtotal: 2999.00
      }
    ],
    address: {
      name: '李四',
      phone: '13900139000',
      province: '广东省',
      city: '深圳市',
      district: '福田区',
      detail: '福田路2号'
    },
    logistics: {
      company: '顺丰快递',
      trackingNumber: 'SF1234567891',
      status: '派送中',
      timeline: [
        { time: '2024-03-08 14:20:00', status: '派送中' },
        { time: '2024-03-08 10:30:00', status: '已发货' }
      ]
    }
  }
]

// 订单详情数据
const orderDetail = ref(null)

// 根据ID获取订单详情
const getOrderDetail = () => {
  orderDetail.value = orderList.find(order => order.id === orderId)
}

// 获取状态标签类型
const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    paid: 'info',
    shipped: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态显示文本
const getStatusText = (status) => {
  const textMap = {
    pending: '待付款',
    paid: '已付款',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  }
  return textMap[status] || status
}

// 组件挂载时获取订单详情
onMounted(() => {
  getOrderDetail()
})
</script>

<template>
  <div class="order-detail-container" v-if="orderDetail">
    <div class="back-button-container">
      <el-button @click="goBack" :icon="ArrowLeft">返回订单列表</el-button>
    </div>
    <el-card class="detail-card">
      <!-- 订单基本信息 -->
      <div class="section">
        <h2 class="section-title">订单信息</h2>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ orderDetail.id }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getStatusType(orderDetail.status)">
              {{ getStatusText(orderDetail.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="下单时间">{{ orderDetail.createTime }}</el-descriptions-item>
          <el-descriptions-item label="订单金额">¥{{ orderDetail.amount.toFixed(2) }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 支付信息 -->
      <div class="section">
        <h2 class="section-title">支付信息</h2>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="支付方式">{{ orderDetail.paymentInfo.method }}</el-descriptions-item>
          <el-descriptions-item label="支付时间">{{ orderDetail.paymentInfo.payTime }}</el-descriptions-item>
          <el-descriptions-item label="交易号">{{ orderDetail.paymentInfo.transactionId }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 商品信息 -->
      <div class="section">
        <h2 class="section-title">商品信息</h2>
        <el-table :data="orderDetail.items" border>
          <el-table-column prop="name" label="商品名称" />
          <el-table-column prop="price" label="单价">
            <template #default="{ row }">
              ¥{{ row.price.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="100" />
          <el-table-column prop="subtotal" label="小计">
            <template #default="{ row }">
              ¥{{ row.subtotal.toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 收货信息 -->
      <div class="section">
        <h2 class="section-title">收货信息</h2>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="收货人">{{ orderDetail.address.name }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ orderDetail.address.phone }}</el-descriptions-item>
          <el-descriptions-item label="收货地址" :span="2">
            {{ orderDetail.address.province }}{{ orderDetail.address.city }}{{ orderDetail.address.district }}{{ orderDetail.address.detail }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 物流信息 -->
      <div class="section">
        <h2 class="section-title">物流信息</h2>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="物流公司">{{ orderDetail.logistics.company }}</el-descriptions-item>
          <el-descriptions-item label="物流单号">{{ orderDetail.logistics.trackingNumber }}</el-descriptions-item>
          <el-descriptions-item label="物流状态">{{ orderDetail.logistics.status }}</el-descriptions-item>
        </el-descriptions>
        <el-timeline class="logistics-timeline">
          <el-timeline-item
            v-for="(activity, index) in orderDetail.logistics.timeline"
            :key="index"
            :timestamp="activity.time"
          >
            {{ activity.status }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </div>
  <div v-else class="no-data">
    <el-empty description="未找到订单信息" />
  </div>
</template>

<style scoped>
.back-button-container {
  margin-bottom: 16px;
}

.order-detail-container {
  padding: 20px;
}

.detail-card {
  margin-bottom: 20px;
}

.section {
  margin-bottom: 24px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #303133;
}

.logistics-timeline {
  margin-top: 16px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.no-data {
  padding: 40px;
  text-align: center;
}
</style>