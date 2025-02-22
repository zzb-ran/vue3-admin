import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import Layout from '../views/layout/index.vue'
import { Odometer, Document, List, DataAnalysis, Film, VideoPlay } from '@element-plus/icons-vue'

const router = createRouter({
  history: createWebHistory(process.env.NODE_ENV === 'production' ? '/vue3-admin/' : '/'),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/index.vue'),
      meta: {
        hidden: true
      }
    },
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('../views/dashboard/index.vue'),
          meta: {
            title: '仪表盘',
            icon: Odometer
          }
        },
        {
          path: '/orders',
          name: 'orders',
          component: () => import('../views/orders/index.vue'),
          redirect: 'orders-list',
          meta: {
            title: '订单管理',
            icon: Document
          },
          children: [
            {
              path: 'orders-list',
              name: 'orders-list',
              component: () => import('../views/orders/list.vue'),
              meta: {
                title: '订单列表',
                icon: List
              }
            },
            {
              path: 'detail/:id',
              name: 'orders-detail',
              component: () => import('../views/orders/detail.vue'),
              meta: {
                title: '订单详情',
                icon: Document,
                hidden: true,
                activeMenu: '/orders/'
              }
            },
            {
              path: 'price-analysis',
              name: 'orders-price-analysis',
              component: () => import('../views/orders/price-analysis.vue'),
              meta: {
                title: '价格分析',
                icon: DataAnalysis
              }
            }
          ]
        },
        {
          path: '/media',
          name: 'media',
          component: () => import('../views/media/index.vue'),
          redirect: 'media-tv',
          meta: {
            title: '影视管理',
            icon: Film
          },
          children: [
            {
              path: 'media-tv',
              name: 'media-tv',
              component: () => import('../views/media/tv.vue'),
              meta: {
                title: '电视剧',
                icon: VideoPlay
              }
            },
            {
              path: 'media-movie',
              name: 'media-movie',
              component: () => import('../views/media/movie.vue'),
              meta: {
                title: '电影',
                icon: Film
              }
            },
            {
              path: 'detail/:id',
              name: 'media-detail',
              component: () => import('../views/media/detail.vue'),
              meta: {
                title: '详情',
                icon: Document,
                hidden: true,
                activeMenu: '/media/'
              }
            }
          ]
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login') {
    if (token) {
      next('/dashboard')
      return
    }
    next()
    return
  }

  if (!token) {
    ElMessage.warning('请先登录')
    next('/login')
    return
  }
  next()
})

export default router