<script setup>
import { computed } from 'vue'
import { ArrowLeft } from '@element-plus/icons-vue'

const props = defineProps({
    media: {
        type: Object,
        required: true
    }
})

// 计算评分的颜色
const ratingColor = computed(() => {
    const rating = props.media.rating
    if (rating >= 8) return '#67C23A'
    if (rating >= 6) return '#E6A23C'
    return '#F56C6C'
})

// 定义emit事件
const emit = defineEmits(['back'])

// 返回上一页
const goBack = () => {
    emit('back')
}

console.log(props.media)
</script>

<template>
    <div class="media-detail-container">
        <div class="back-button-container">
            <el-button @click="goBack" :icon="ArrowLeft">返回列表</el-button>
        </div>
        <el-card class="detail-card">
            <div class="media-info">
                <div class="poster">
                    <el-image
                        :src="media.posterPath ? 'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + media.posterPath : ''"
                        fit="cover" :error-src="'https://via.placeholder.com/300x400?text=No+Image'"
                        :preview-src-list="media.posterPath ? ['https://image.tmdb.org/t/p/w600_and_h900_bestv2' + media.posterPath] : []" />
                </div>
                <div class="info">
                    <h1 class="title">{{ media.title }}</h1>
                    <el-descriptions :column="1">
                        <el-descriptions-item label="类型">
                            <el-tag v-for="genre in media.genres" :key="genre.id" class="genre-tag" size="small">
                                {{ genre.name }}
                            </el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="原标题">{{ media.originalTitle }}</el-descriptions-item>
                        <el-descriptions-item label="上映日期">{{ media.releaseDate }}</el-descriptions-item>
                        <el-descriptions-item label="状态">{{ media.status }}</el-descriptions-item>
                        <el-descriptions-item label="季数" v-if="media.type === 'tv'">{{ media.seasonsCount
                            }}季</el-descriptions-item>
                        <el-descriptions-item label="集数" v-if="media.type === 'tv'">{{ media.episodeCount
                            }}集</el-descriptions-item>
                        <el-descriptions-item label="时长" v-if="media.type === 'movie'">{{ media.runtime
                            }}分钟</el-descriptions-item>
                        <el-descriptions-item label="评分">
                            <span :style="{ color: ratingColor }">{{ media.rating.toFixed(1) }}</span>
                        </el-descriptions-item>
                    </el-descriptions>
                </div>
            </div>
            <div class="description">
                <h2>剧情简介</h2>
                <p>{{ media.overview || '暂无简介' }}</p>
            </div>
        </el-card>
    </div>
</template>

<style scoped>
.media-detail-container {
    padding: 20px;
}

.back-button-container {
    margin-bottom: 16px;
}

.detail-card {
    margin-bottom: 20px;
}

.media-info {
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
}

.poster {
    flex-shrink: 0;
    width: 300px;
}

.poster :deep(.el-image) {
    width: 100%;
    height: 400px;
    border-radius: 8px;
    overflow: hidden;
}

.info {
    flex: 1;
}

.title {
    font-size: 24px;
    font-weight: bold;
    margin: 0 0 12px 0;
    color: var(--el-text-color-primary);
}

.description {
    margin-top: 24px;
}

.description h2 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 16px;
    color: var(--el-text-color-primary);
}

.description p {
    line-height: 1.6;
    color: var(--el-text-color-regular);
}

.genre-tag {
    display: inline-flex;
    align-items: center;
    margin-right: 8px;
    margin-bottom: 4px;
}
</style>