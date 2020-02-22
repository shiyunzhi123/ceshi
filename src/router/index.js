import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/space',
    meta: { title: '空间', icon: 'handle' },
    children: [{
      path: 'space',
      name: 'Space',
      component: () => import('@/views/space/index'),
      meta: { title: '空间', name: '空间', icon: 'spacehome' }
    },
    {
      path: 'create/:id?',
      name: 'SpaceCreate',
      hidden: true,
      component: () => import('@/views/space/create'),
      meta: { title: '创建房源', name: '创建房源', icon: 'spacehome' }
    }]
  },

  {
    path: '/exercise',
    component: Layout,
    redirect: '/exercise',
    meta: { title: '招商', name: '招商', icon: 'handle' },
    children: [
      {
        path: '',
        name: 'Business',
        component: () => import('@/views/exercise/index'),
        meta: { title: '招商中心', name: '招商', icon: 'handle' }
      },
      {
        path: 'attract',
        name: 'Attract',
        hidden: true,
        component: () => import('@/views/exercise/attract'),
        meta: { title: '活动管理', name: '活动', icon: 'handle' }
      },
      {
        path: 'attract/create/:id?',
        name: 'AttractCreate',
        hidden: true,
        component: () => import('@/views/exercise/attractCreate'),
        meta: { title: '创建活动', name: '创建', icon: 'handle' }
      },
      {
        path: 'commission',
        name: 'Commission',
        hidden: true,
        component: () => import('@/views/exercise/commission'),
        meta: { title: '佣金政策', name: '佣金', icon: 'handle' }
      },
      {
        path: 'commission/create:id?',
        name: 'CommissionCreate',
        hidden: true,
        component: () => import('@/views/exercise/commissionCreate'),
        meta: { title: '创建佣金政策', name: '创建', icon: 'handle' }
      }
    ]
  },

  {
    path: '/data',
    component: Layout,
    meta: { title: '数据', name: '数据', icon: 'handle' },
    children: [
      {
        path: 'index',
        name: 'Data',
        component: () => import('@/views/data/index'),
        meta: { title: '数据', name: '数据', icon: 'number' }
      }
    ]
  },


  {
    path: '/setting',
    component: Layout,
    meta: { title: '空间管理', name: '空间管理',  },
    children: [
      {
        path: 'index',
        name: 'setting',
        component: () => import('@/views/setting/index'),
        meta: { title: '企业信息', name: '企业信息',  }
      }
    ]
  },




  {
    path: '/person',
    component: Layout,
    meta: { title: '空间管理', name: '空间管理',  },
    children: [
      {
        path: 'index',
        name: 'person',
        component: () => import('@/views/person/index'),
        meta: { title: '个人信息', name: '个人信息',  }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
