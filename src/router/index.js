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
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '仪表盘', icon: 'dashboard' }
    }]
  },

  {
    path: '/project',
    component: Layout,
    name: 'coreProject',
    meta: { title: '项目管理', icon: 'el-icon-s-unfold' },
    alwaysShow: true,
    children: [
      {
        path: 'category',
        name: 'coreProjectList',
        component: () => import('@/views/project/categoryList'),
        meta: { title: '项目列表' }
      },
      {
        path: 'edit/:id',
        name: 'coreProjectDetail',
        component: () => import('@/views/project/edit'),
        meta: { title: '发行编辑' },
        hidden: true
      }
    ]
  },

  {
    path: '/doc',
    component: Layout,
    name: 'coreDoc',
    meta: { title: '文档管理', icon: 'el-icon-s-flag' },
    alwaysShow: true,
    children: [
      {
        path: 'category',
        name: 'coreDocCategoryList',
        component: () => import('@/views/doc/categoryList'),
        meta: { title: '分类列表' }
      },
      {
        path: 'menu/:versionId',
        name: 'coreDocMenuList',
        component: () => import('@/views/doc/menuList'),
        meta: { title: '目录列表' },
        hidden: true
      },
      {
        path: 'detail/:versionId/:menuId',
        name: 'coreDocDetail',
        component: () => import('@/views/doc/detail'),
        meta: { title: '文档详情' },
        hidden: true
      },
      {
        path: 'edit/:versionId/:menuId',
        name: 'coreDocEdit',
        component: () => import('@/views/doc/edit'),
        meta: { title: '文档编辑' },
        hidden: true
      },
    ]
  },

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: 'coreUser',
    meta: { title: '用户管理', icon: 'user', roles: 'admin' },
    alwaysShow: true,
    children: [
      {
        path: 'list',
        name: 'coreUserList',
        component: () => import('@/views/user/list'),
        meta: { title: '用户列表' }
      },
      {
        path: 'auth/:id',
        name: 'coreUserAuth',
        component: () => import('@/views/user/auth'),
        meta: { title: '用户授权' },
        hidden: true
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

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
