<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const orders = ref([
  {
    id: '1',
    customer: '张三',
    product: '商品A',
    amount: 1999,
    status: '已完成',
    date: '2023-12-01'
  },
  {
    id: '2',
    customer: '李四',
    product: '商品B',
    amount: 2999,
    status: '处理中',
    date: '2023-12-02'
  }
])

// 分页相关数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(2)

// 查看详情
const handleDetail = (row) => {
  router.push(`/orders/detail/${row.id}`)
}

// 删除订单
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该订单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里添加实际的删除逻辑
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 页码改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  // 这里添加实际的分页加载逻辑
}

// 每页条数改变
const handleSizeChange = (val) => {
  pageSize.value = val
  // 这里添加实际的分页加载逻辑
}
</script>

<template>
  <div class="orders-container">
    <el-card class="orders-list">
      <template #header>
        <div class="card-header">
          <span>订单列表</span>
        </div>
      </template>
      <el-table :data="orders">
        <el-table-column prop="id" label="订单号" width="120" />
        <el-table-column prop="customer" label="客户名称" width="120" />
        <el-table-column prop="product" label="商品" />
        <el-table-column prop="amount" label="金额">
          <template #default="{ row }">
            ¥{{ row.amount }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '已完成' ? 'success' : 'warning'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click.stop="handleDetail(row)">查看</el-button>
            <el-button link type="danger" @click.stop="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.orders-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.orders-list {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>