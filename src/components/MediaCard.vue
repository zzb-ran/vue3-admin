<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  media: {
    type: Object,
    required: true
  }
})

const router = useRouter()

// 计算评分的颜色
const ratingColor = computed(() => {
  const rating = props.media.rating
  if (rating >= 8) return '#67C23A'
  if (rating >= 6) return '#E6A23C'
  return '#F56C6C'
})

// 跳转到详情页
const goToDetail = () => {
  router.push(`/media/detail/${props.media.id}`)
}
</script>

<template>
  <div class="media-card" @click="goToDetail">
    <div class="poster-wrapper">
      <el-image
        :src="media.posterPath"
        fit="cover"
        class="poster"
      />
      <div class="poster-overlay"></div>
      <div class="rating">
        <span :style="{ color: ratingColor }">{{ media.rating.toFixed(1) }}</span>
      </div>
    </div>
    <div class="info">
      <h3 class="title">{{ media.title }}</h3>
      <p class="original-title">{{ media.originalTitle }}</p>
      <p class="release-date">{{ media.releaseDate }}</p>
    </div>
  </div>
</template>

<style scoped>
.media-card {
  background: var(--el-bg-color);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  width: 180px;
}

.media-card:hover {
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.media-card:hover .poster {
  transform: scale(1.05);
}

.poster-wrapper {
  position: relative;
  width: 100%;
  padding-top: 130%; /* 更适合的海报比例 */
}

.poster {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.rating {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.75);
  padding: 4px 8px;
  border-radius: 4px;
}

.rating span {
  font-size: 14px;
  font-weight: bold;
}

.info {
  padding: 10px;
}

.title {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--el-text-color-primary);
}

.original-title {
  margin: 4px 0;
  font-size: 12px;
  color: var(--el-text-color-regular);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.release-date {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>