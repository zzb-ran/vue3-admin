<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import NesEmulator from '@/components/NesEmulator.vue'
import { Upload, VideoPlay } from '@element-plus/icons-vue'

const title = ref('NES游戏模拟器')
const nesEmulator = ref(null)

// 预设游戏列表
const presetGames = [
    { 
        name: '合金弹头1',
        url: 'https://img.femooc.com/roms/%E8%A1%97%E6%9C%BA/%E5%90%88%E9%87%91%E5%BC%B9%E5%A4%B41/mslug.zip',
        core: 'arcade',
        cover: './games/covers/mslug1.png'
    },
    { 
        name: '合金弹头X',
        url: 'https://img.femooc.com/roms/%E8%A1%97%E6%9C%BA/%E5%90%88%E9%87%91%E5%BC%B9%E5%A4%B4X/mslugx.zip',
        core: 'arcade',
        cover: './games/covers/mslug-x.png'
    },
    { 
        name: '合金弹头2',
        url: 'https://img.femooc.com/roms/%E8%A1%97%E6%9C%BA/%E5%90%88%E9%87%91%E5%BC%B9%E5%A4%B42/mslug2.zip',
        core: 'arcade',
        cover: './games/covers/mslug2.png'
    },
    { 
        name: '合金弹头3',
        url: 'https://img.femooc.com/roms/%E8%A1%97%E6%9C%BA/%E5%90%88%E9%87%91%E5%BC%B9%E5%A4%B43/mslug3.zip',
        core: 'arcade',
        cover: './games/covers/mslug3.png'
    },
    { 
        name: '合金弹头4',
        url: 'https://img.femooc.com/roms/%E8%A1%97%E6%9C%BA/%E5%90%88%E9%87%91%E5%BC%B9%E5%A4%B44/mslug4.zip',
        core: 'arcade',
        cover: './games/covers/mslug4.png'
    },
    { 
        name: '合金弹头5',
        url: 'https://img.femooc.com/roms/%E8%A1%97%E6%9C%BA/%E5%90%88%E9%87%91%E5%BC%B9%E5%A4%B45/mslug5.zip',
        core: 'arcade',
        cover: './games/covers/mslug5.png'
    },
    {
        name: '超级玛丽',
        url: './games/roms/超级玛丽.nes',
        core: 'nes',
        cover: './games/covers/超级玛丽.png'
    },
    {
        name: '热血格斗',
        url: './games/roms/热血格斗.nes',
        core: 'nes',
        cover: './games/covers/热血格斗.png'
    },
    {
        name: '赤影战士',
        url: './games/roms/赤影战士.nes',
        core: 'nes',
        cover: './games/covers/赤影战士.png'
    },
    {
        name: '赤色要塞',
        url: './games/roms/赤色要塞.nes',
        core: 'nes',
        cover: './games/covers/赤色要塞.png'
    },
    {
        name: '超级大富翁',
        url: './games/roms/超级大富翁(百万富翁).nes',
        core: 'nes',
        cover: './games/covers/超级大富翁(百万富翁).png'
    },
    {
        name: '雪人兄弟',
        url: './games/roms/雪人兄弟.nes',
        core: 'nes',
        cover: './games/covers/雪人兄弟.png'
    }
]

// 加载预设游戏
const loadPresetGame = async (game) => {
    try {
        if (game.core === 'arcade') {
            // 街机游戏直接使用URL加载
            nesEmulator.value.initEmulator(game.url, game.core)
        } else {
            // 其他游戏转换为blob加载
            const response = await fetch(game.url)
            const blob = await response.blob()
            const file = new File([blob], `${game.name}.${game.core}`, { type: 'application/octet-stream' })
            nesEmulator.value.initEmulator(file)
        }
    } catch (error) {
        ElMessage.error('加载游戏失败：' + error.message)
    }
}

// 处理文件上传
const handleFileUpload = (event) => {
    const file = event.raw
    if (!file) return

    const validExtensions = [
        '.nes', '.fds', '.sfc', '.smc', '.z64', '.n64', '.v64',
        '.pce', '.ngp', '.ngc', '.ws', '.wsc', '.col', '.d64',
        '.gb', '.gbc', '.gba', '.smd', '.gen', '.md', '.32x',
        '.sms', '.gg', '.a26', '.a78', '.lnx', '.vec', '.nds',
        '.vb'
    ]
    

    const fileName = file.name.toLowerCase()

    if (!validExtensions.some(ext => fileName.endsWith(ext))) {
        ElMessage.error('请上传有效的ROM文件')
        return
    }

    if (!nesEmulator.value) {
        ElMessage.error('模拟器组件未准备就绪，请稍后再试')
        return
    }

    nesEmulator.value.initEmulator(file)
}
</script>

<template>
  <div class="nes-container">
    <div class="game-selection" v-if="!nesEmulator?.isPlaying">
      <!-- 预设游戏卡片 -->
      <el-card class="game-card">
        <template #header>
          <div class="card-header">
            <span class="title"><el-icon><video-play /></el-icon> 预设游戏</span>
          </div>
        </template>
        <div class="preset-games">
          <div class="game-grid">
            <div v-for="game in presetGames" :key="game.name" class="game-item" @click="loadPresetGame(game)">
              <div class="game-cover">
                <img :src="game.cover" :alt="game.name">
              </div>
              <div class="game-name">{{ game.name }}</div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 上传ROM卡片 -->
      <el-card class="upload-card">
        <template #header>
          <div class="card-header">
            <span class="title"><el-icon><upload /></el-icon> 上传ROM文件</span>
          </div>
        </template>
        <div class="upload-area">
          <el-upload
            class="upload-container"
            accept=".nes,.fds,.sfc,.smc,.z64,.n64,.v64,.pce,.ngp,.ngc,.ws,.wsc,.col,.d64,.gb,.gbc,.gba,.smd,.gen,.md,.32x,.sms,.gg,.a26,.a78,.lnx,.vec,.nds,.vb"
            :auto-upload="false"
            :show-file-list="false"
            @change="handleFileUpload"
            drag
          >
            <el-icon class="el-icon--upload"><upload /></el-icon>
            <div class="el-upload__text">
              将ROM文件拖到此处，或 <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持的格式：.nes, .sfc, .smc 等
              </div>
            </template>
          </el-upload>
        </div>
      </el-card>
    </div>
    <NesEmulator ref="nesEmulator" />
  </div>
</template>

<style scoped>
.nes-container {
  padding: 20px;
  min-height: calc(100vh - 200px);
  background-color: var(--el-bg-color);
}

.game-selection {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.game-card,
.upload-card {
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
}

.card-header .title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  padding: 10px;
  max-height: calc(150px * 2 + 20px);
  overflow-y: auto;
}

.game-grid::-webkit-scrollbar {
  width: 6px;
}

.game-grid::-webkit-scrollbar-track {
  background: var(--el-fill-color-lighter);
  border-radius: 3px;
}

.game-grid::-webkit-scrollbar-thumb {
  background: var(--el-border-color);
  border-radius: 3px;
}

.game-grid::-webkit-scrollbar-thumb:hover {
  background: var(--el-border-color-darker);
}

.game-item {
  cursor: pointer;
  transition: transform 0.2s;
  text-align: center;
}

.game-item:hover {
  transform: translateY(-5px);
}

.game-cover {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.game-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.game-name {
  margin-top: 8px;
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.upload-container {
  width: 100%;
}

:deep(.el-upload-dragger) {
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

:deep(.el-icon--upload) {
  font-size: 48px;
  color: var(--el-text-color-secondary);
  margin-bottom: 16px;
}

.el-upload__text {
  color: var(--el-text-color-regular);
  margin: 16px 0;
}

.el-upload__text em {
  color: var(--el-color-primary);
  font-style: normal;
}

.el-upload__tip {
  text-align: center;
  color: var(--el-text-color-secondary);
}

@media (max-width: 768px) {
  .game-selection {
    grid-template-columns: 1fr;
  }
}
</style>