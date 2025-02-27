<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

// 检查是否为移动设备
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

const router = useRouter()
const isPlaying = ref(false)

// 返回到NES游戏选择界面
const goBack = () => {
    // 清理游戏实例
    const gameElement = document.querySelector('#game')
    if (gameElement) {
        // 停止所有游戏相关的进程
        if (window.EJS_emulator) {
            try {
                // 停止游戏运行
                window.EJS_emulator.functions.exit[0]()
                // 确保音频完全停止
                if (window.EJS_emulator.audio && window.EJS_emulator.audio.context) {
                    window.EJS_emulator.audio.context.close()
                }

                // 移除所有事件监听器
                if (window.EJS_emulator.keydown) {
                    window.removeEventListener('keydown', window.EJS_emulator.keydown)
                }
                if (window.EJS_emulator.keyup) {
                    window.removeEventListener('keyup', window.EJS_emulator.keyup)
                }

                // 移除加载的脚本
                const loaderScript = document.querySelector('script[src*="loader.js"]')
                if (loaderScript) {
                    loaderScript.remove()
                }
            } catch (error) {
                console.error('清理游戏实例时发生错误:', error)
            } finally {
                // 确保无论如何都会执行清理操作
                // 移除游戏DOM元素
                gameElement.innerHTML = ''
                gameElement.remove()
            }
            // 清理全局变量
            window.EJS_emulator = null
            window.EJS_player = null
            window.EJS_gameUrl = null
            window.EJS_ready = null
            window.EJS_Buttons = null
            window.EJS_defaultControls = null
            window.EJS_core = null
            window.EJS_pathtodata = null
            window.EJS_startOnLoaded = null
            window.EJS_language = null
            window.EJS_gameID = null
            window.EJS_gameName = null
        }
        isPlaying.value = false
        router.push('/nes')
    }
}

// 从本地存储获取按键配置，如果没有则使用默认配置
const defaultControls = {
    0: {
        0: { value: 'j', value2: 'BUTTON_2' },     // B按钮
        2: { value: 'shift', value2: 'SELECT' },     // 选择
        3: { value: 'enter', value2: 'START' },    // 开始
        4: { value: 'w', value2: 'DPAD_UP' },      // 上
        5: { value: 's', value2: 'DPAD_DOWN' },    // 下
        6: { value: 'a', value2: 'DPAD_LEFT' },    // 左
        7: { value: 'd', value2: 'DPAD_RIGHT' },   // 右
        8: { value: 'k', value2: 'BUTTON_1' },     // A按钮
        10: { value: 'o', value2: 'LEFT_TOP_SHOULDER' },
        11: { value: 'i', value2: 'RIGHT_TOP_SHOULDER' },
        13: { value: 'l', value2: 'RIGHT_BOTTOM_SHOULDER' },     
    },
    1: {
        0: { value: 'numpad 1', value2: 'BUTTON_2' },     // B按钮
        2: { value: 'numpad 0', value2: 'SELECT' },     // 选择
        3: { value: 'decimal point', value2: 'START' },    // 开始
        4: { value: 'up arrow', value2: 'DPAD_UP' },      // 上
        5: { value: 'down arrow', value2: 'DPAD_DOWN' },    // 下
        6: { value: 'left arrow', value2: 'DPAD_LEFT' },    // 左
        7: { value: 'right arrow', value2: 'DPAD_RIGHT' },   // 右
        8: { value: 'numpad 2', value2: 'BUTTON_1' },     // A按钮
        10: { value: 'numpad 6', value2: 'LEFT_TOP_SHOULDER' },
        11: { value: 'numpad 5', value2: 'RIGHT_TOP_SHOULDER' },
        13: { value: 'numpad 3', value2: 'RIGHT_BOTTOM_SHOULDER' }, 
    },
    2: {},
    3: {}
}

const defaultButtons = {
    playPause: true,
    restart: true,
    mute: true,
    settings: false,
    fullscreen: true,
    saveState: false,
    loadState: false,
    screenRecord: false,
    gamepad: false,
    cheat: false,
    volume: true,
    saveSavFiles: true,
    loadSavFiles: true,
    quickSave: false,
    quickLoad: false,
    screenshot: true,
    cacheManager: false,
    exitEmulation: true
}

// 初始化模拟器
// 处理屏幕方向锁定
const lockScreenOrientation = async () => {
    try {
        if (isMobile && screen.orientation && screen.orientation.lock) {
            await screen.orientation.lock('landscape')
        }
    } catch (error) {
        console.warn('无法锁定屏幕方向:', error)
    }
}

// 处理全屏显示
const requestFullscreen = async () => {
    try {
        if (isMobile) {
            const gameArea = document.querySelector('.game-area')
            if (gameArea && gameArea.requestFullscreen) {
                await gameArea.requestFullscreen()
            }
        }
    } catch (error) {
        console.warn('无法进入全屏模式:', error)
    }
}

// 初始化模拟器
const initEmulator = async (romFile, core) => {
    // 先设置状态，确保game-area元素被渲染
    isPlaying.value = true
    
    // 如果是移动设备，锁定屏幕方向并请求全屏
    if (isMobile) {
        await lockScreenOrientation()
        await requestFullscreen()
    }

    // 等待DOM更新后再初始化模拟器
    nextTick(() => {
        // 清理之前可能存在的EmulatorJS实例
        const oldEmulator = document.querySelector('#game')
        if (oldEmulator) {
            oldEmulator.innerHTML = ''
            oldEmulator.remove()
        }

        // 创建游戏容器
        const gameDiv = document.createElement('div')
        gameDiv.id = 'game'
        gameDiv.style.width = '100%'
        gameDiv.style.height = '100%'
        document.querySelector('.game-area').appendChild(gameDiv)

        // 根据文件类型选择核心
        let core;
        let gameName;
        let gameUrl;

        if (typeof romFile === 'string') {
            // 如果romFile是字符串，说明是直接传入的URL（用于街机游戏）
            gameUrl = romFile;
            gameName = gameUrl.split('/').pop().split('.')[0];
            core = 'arcade';
        } else {
            // 如果romFile是File对象，需要处理文件
            const parts = romFile.name.split(".")
            gameName = parts[0]
            core = determineCore(parts.pop())
            gameUrl = URL.createObjectURL(romFile)
        }

        // 地区设置（仅用于街机游戏）
        const dipswitch = 'fbneo-dipswitch-' + gameName + '-Region_(Fake)';
        const Territory = 'fbneo-dipswitch-' + gameName + '-Territory';

        // 设置EmulatorJS的配置
        window.EJS_player = '#game'
        window.EJS_language = 'zh-CN'
        window.EJS_gameID = Math.random().toString(36).substr(2, 9)
        window.EJS_gameName = gameName
        window.EJS_gameUrl = gameUrl
        window.EJS_core = core
        window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/" // 这里设置CDN地址
        window.EJS_startOnLoaded = true
        window.EJS_DEBUG_XX = true;
        window.EJS_disableDatabases = true;
        window.EJS_threads = false;
        window.EJS_biosUrl = "./games/roms/arcade.7z";
        // 菜单配置
	    // window.EJS_defaultOptions = {
        //     'shader': 'crt-easymode.glslp',
        //     'save-state-location': 'browser',
        //     // [dipswitch]: 'China',
        //     // [Territory]: 'Hong Kong'
	    // }

        // 使用统一的按键配置
        // window.EJS_Buttons = defaultButtons
        window.EJS_defaultControls = defaultControls

        const script = document.createElement('script')
        script.src = "https://cdn.emulatorjs.org/stable/data/loader.js"
        script.onload = () => {
            console.log('EmulatorJS 脚本加载完成')
            window.EJS_ready && window.EJS_ready()
        }
        script.onerror = () => {
            ElMessage.error('EmulatorJS 脚本加载失败')
        }
        document.body.appendChild(script)
    })
}

// 根据扩展名选择模拟器核心
const determineCore = (ext) => {
    if (["fds", "nes", "unif", "unf"].includes(ext)) return "nes"
    if (["smc", "fig", "sfc", "gd3", "gd7", "dx2", "bsx", "swc"].includes(ext)) return "snes"
    if (["z64", "n64", "v64"].includes(ext)) return "n64"
    if (["pce", "bin", "sgx"].includes(ext)) return "pce"
    if (["ngp", "ngc", "ngf"].includes(ext)) return "ngp"
    if (["ws", "wsc", "wsr"].includes(ext)) return "ws"
    if (["col", "cv", "bin", "rom"].includes(ext)) return "coleco"
    if (["d64", "g64", "x64", "t64", "tap", "prg"].includes(ext)) return "vice_x64"
    if (["gb", "gbc"].includes(ext)) return "gb"
    if (["gba", "agb"].includes(ext)) return "gba"
    if (["smd", "gen", "md", "bin"].includes(ext)) return "segaMD"
    if (["32x", "bin"].includes(ext)) return "sega32x"
    if (["sms", "gg", "sg"].includes(ext)) return "segaMS"
    if (["a26", "bin"].includes(ext)) return "atari2600"
    if (["a78", "bin"].includes(ext)) return "atari7800"
    if (["lnx"].includes(ext)) return "lynx"
    if (["vec"].includes(ext)) return "vectrex"
    if (["nds"].includes(ext)) return "nds"
    if (["vb"].includes(ext)) return "vb"
    if (["zip"].includes(ext)) return "arcade"
    return ext
}

// 导出组件方法和状态供父组件调用
defineExpose({
    initEmulator,
    isPlaying
})
</script>

<template>
    <div class="game-area" v-if="isPlaying">
        <div class="back-button">
            <el-button @click="goBack" :icon="ArrowLeft" size="small">返回</el-button>
        </div>
    </div>
</template>

<style scoped>
.nes-emulator {
    width: 100%;
    margin: 0 auto;
}

.empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    background-color: #f5f7fa;
    border-radius: 8px;
}

.empty-text {
    color: var(--el-text-color-secondary);
    font-size: 16px;
}

.back-button {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1000;
}

.game-area {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
    aspect-ratio: 4/3;
    background-color: #000;
}

@media (max-width: 768px) {
    .game-area {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        max-width: none;
        margin: 0;
        aspect-ratio: unset;
    }

    .back-button {
        position: fixed;
        top: env(safe-area-inset-top, 10px);
        left: env(safe-area-inset-left, 10px);
    }
}

#game {
    width: 100%;
    max-width: 512px;
    aspect-ratio: 4/3;
    background-color: #000;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    overflow: hidden;
}
</style>
