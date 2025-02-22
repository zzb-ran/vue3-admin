<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { tvApi, movieApi, formatTvShow, formatMovie } from '@/utils/tmdb'
import MediaDetail from '@/components/MediaDetail.vue'

const route = useRoute()
const router = useRouter()
const mediaId = route.params.id

// 返回列表
const goBack = () => {
  router.back()
}

// 影视详情数据
const mediaDetail = ref(null)
const loading = ref(false)

// 获取影视详情
const getMediaDetail = async () => {
  loading.value = true
  try {
    // 尝试获取电视剧详情
    try {
      const response = await tvApi.getDetails(mediaId)
      const show = formatTvShow(response.data)
      mediaDetail.value = {
        ...show,
        type: 'tv',
        poster: show.posterPath,
        actors: response.data.created_by?.map(person => person.name) || [],
        director: response.data.created_by?.[0]?.name || '未知',
        description: show.overview,
        episodes: show.episodeCount,
        seasons: show.seasonCount
      }
      return
    } catch (e) {
      // 如果不是电视剧，尝试获取电影详情
      const response = await movieApi.getDetails(mediaId)
      const movie = formatMovie(response.data)
      // 状态映射
      const statusMap = {
        'Rumored': '传闻',
        'Planned': '计划中',
        'In Production': '制作中',
        'Post Production': '后期制作',
        'Released': '已上映',
        'Canceled': '已取消'
      }
      mediaDetail.value = {
        ...movie,
        type: 'movie',
        poster: movie.posterPath,
        actors: response.data.credits?.cast?.slice(0, 5).map(actor => actor.name) || [],
        status: statusMap[response.data.status] || response.data.status,
        director: response.data.credits?.crew?.find(person => person.job === 'Director')?.name || '未知',
        description: movie.overview,
        runtime: movie.runtime,
        genres: response.data.genres || [],
        status: movie.status || '未知'
      }
    }
  } catch (error) {
    console.error('获取影视详情失败:', error)
    ElMessage.error('获取影视详情失败')
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取详情
onMounted(() => {
  getMediaDetail()
})
</script>

<template>
  <div v-if="mediaDetail">
    <MediaDetail
      :media="{
        id: mediaDetail.id,
        title: mediaDetail.title,
        originalTitle: mediaDetail.title,
        type: mediaDetail.type,
        posterPath: mediaDetail.poster,
        releaseDate: mediaDetail.releaseDate,
        rating: mediaDetail.rating,
        status: mediaDetail.status,
        seasonsCount: mediaDetail.seasons,
        episodeCount: mediaDetail.episodes,
        runtime: mediaDetail.runtime,
        overview: mediaDetail.description,
        genres: mediaDetail.genres,
      }"
      @back="goBack"
    />
  </div>
  <div v-else class="no-data">
    <el-empty description="未找到影视信息" />
  </div>
</template>

<style scoped>
.no-data {
  padding: 40px;
  text-align: center;
}
</style>