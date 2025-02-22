<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { movieApi, formatMovie } from '@/utils/tmdb'
import MediaCard from '@/components/MediaCard.vue'

const router = useRouter()
const movies = ref([])
const loading = ref(false)

// 分页相关数据
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 当前选中的分类
const activeCategory = ref('popular')

// 分类选项
const categories = [
  { key: 'popular', label: '热门', api: movieApi.getPopular },
  { key: 'now_playing', label: '正在上映', api: movieApi.getNowPlaying },
  { key: 'upcoming', label: '即将上映', api: movieApi.getUpcoming },
  { key: 'top_rated', label: '高分', api: movieApi.getTopRated }
]

// 获取电影列表
const getMovies = async () => {
  loading.value = true
  try {
    const category = categories.find(c => c.key === activeCategory.value)
    if (category) {
      const response = await category.api(currentPage.value)
      movies.value = response.data.results.map(formatMovie)
      total.value = response.data.total_results
    }
  } catch (error) {
    console.error('获取电影列表失败:', error)
    ElMessage.error('获取电影列表失败')
  } finally {
    loading.value = false
  }
}

// 切换分类
const handleCategoryChange = (category) => {
  activeCategory.value = category
  currentPage.value = 1
  getMovies()
}

// 页码改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  getMovies()
}

// 组件挂载时获取电影列表
onMounted(() => {
  getMovies()
})
</script>

<template>
  <div class="movie-container">
    <div class="category-tabs">
      <el-radio-group v-model="activeCategory" @change="handleCategoryChange">
        <el-radio-button v-for="category in categories" :key="category.key" :label="category.key">
          {{ category.label }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <div v-loading="loading" class="movies-grid">
      <MediaCard
        v-for="movie in movies"
        :key="movie.id"
        :media="movie"
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
.movie-container {
  padding: 20px;
}

.category-tabs {
  margin-bottom: 20px;
}

.movies-grid {
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