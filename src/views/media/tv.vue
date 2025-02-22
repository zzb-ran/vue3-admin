<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { tvApi, formatTvShow } from '@/utils/tmdb'
import MediaCard from '@/components/MediaCard.vue'

const router = useRouter()
const tvShows = ref([])
const loading = ref(false)

// 分页相关数据
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 当前选中的分类
const activeCategory = ref('popular')

// 分类选项
const categories = [
  { key: 'popular', label: '热门', api: tvApi.getPopular },
  { key: 'airing_today', label: '今日播出', api: tvApi.getAiringToday },
  { key: 'on_the_air', label: '正在播出', api: tvApi.getOnTheAir },
  { key: 'top_rated', label: '高分', api: tvApi.getTopRated }
]

// 获取电视剧列表
const getTvShows = async () => {
  loading.value = true
  try {
    const category = categories.find(c => c.key === activeCategory.value)
    if (category) {
      const response = await category.api(currentPage.value)
      tvShows.value = response.data.results.map(formatTvShow)
      total.value = response.data.total_results
    }
  } catch (error) {
    console.error('获取电视剧列表失败:', error)
    ElMessage.error('获取电视剧列表失败')
  } finally {
    loading.value = false
  }
}

// 查看详情
const handleDetail = (row) => {
  router.push(`/media/detail/${row.id}`)
}

// 删除电视剧
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该电视剧吗？', '提示', {
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
  getTvShows()
}

// 每页条数改变
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  getTvShows()
}

// 分类改变
const handleCategoryChange = () => {
  currentPage.value = 1
  getTvShows()
}

// 组件挂载时获取数据
onMounted(() => {
  getTvShows()
})
</script>

<template>
  <div class="tv-container">
    <div class="category-tabs">
      <el-radio-group v-model="activeCategory" @change="handleCategoryChange">
        <el-radio-button v-for="category in categories" :key="category.key" :label="category.key">
          {{ category.label }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <div v-loading="loading" class="tvs-grid">
      <MediaCard
        v-for="show in tvShows"
        :key="show.id"
        :media="show"
      />
    </div>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style scoped>
.tv-container {
  padding: 20px;
}

.category-tabs {
  margin-bottom: 20px;
}

.tvs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>