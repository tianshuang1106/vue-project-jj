import { createRouter, createWebHistory } from 'vue-router'
import layout from '../layout/index.vue'


export const constantRoutes = [
  {
    path: '/',
    component: layout,
    redirect: '/baseAccount',
    children: [
      {
        meta: {
          title: '基础账号查询',
        },
        path: '/baseAccount',
        component: () => import('../views/BaseAccount/index.vue'),
      },
      {
        meta: {
          title: '账号管理',
        },
        path: '/accountManage',
        component: () => import('../views/AccountManage/index.vue'),
      }
    ]
  },
  {
    path: '/hostManage',
    component: layout,
    children: [
      {
        meta: {
          title: '主机管理',
        },
        path: '/hostManage',
        component: () => import('../views/HostManage/index.vue'),
      }
    ]
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
})
