import { RouteRecordRaw } from "vue-router";
import Layout from '@/layout/Index.vue'
export type RouterConfig = RouteRecordRaw & { alwaysShow?: boolean }
/*
  meta: {
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    hidden: true                 if true, this route will not show in the sidebar (default is false)
    alwaysShow: true             if true, will always show the root menu (default is false)
                                 if false, hide the root menu when has less or equal than one children route
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    noCache: true                if true, the page will not be cached (default is false)
    affix: true                  if true, the tag will affix in the tags-view
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
*/
export const routes: Array<RouterConfig> = [
    {
        path: '/',
        redirect: '/home',
        component: Layout,
        meta: {
            icon: 'el-icon-house',
            title: '首页'
        },
        children: [{
            path: '/home',
            name: 'Home1',
            component: () => import('@/views/Home.vue'),
            meta: {
                title: '首页1'
            }
        }, {
            path: '/home2',
            name: 'Home2',
            component: () => import('@/views/Home.vue'),
            meta: {
            icon: 'el-icon-files',
                title: '首页2'
            }
        }]
    },
    {
        path: '/basic',
        name: 'Basic',
        component: Layout,
        redirect: '/basic/goods',
        meta: {
            icon: 'el-icon-files',
            title: '档案管理',
            alwaysShow: true,
        },
        children: [{
            path: '/basic/goods',
            name: 'BasicGoods',
            component: () => import('@/views/basic/goods/Index.vue'),
            meta: {
                title: '一号档案'
            }
        },{
            path: '/basic/goods2',
            name: 'BasicGoods2',
            component: () => import('@/views/basic/goods/Index.vue'),
            meta: {
                title: '二号档案'
            }
        },{
            path: '/basic/goods3',
            name: 'BasicGoods3',
            component: () => import('@/views/basic/goods/Index.vue'),
            meta: {
                title: '三号档案'
            }
        },{
            path: '/basic/goods4',
            name: 'BasicGoods4',
            component: () => import('@/views/basic/goods/Index.vue'),
            meta: {
                title: '四号档案'
            }
        },{
            path: '/basic/goods5',
            name: 'BasicGoods5',
            component: () => import('@/views/basic/goods/Index.vue'),
            meta: {
                title: '五号档案'
            }
        },{
            path: '/basic/goods6',
            name: 'BasicGoods6',
            component: () => import('@/views/basic/goods/Index.vue'),
            meta: {
                title: '六号档案'
            }
        },{
            path: '/basic/goods7',
            name: 'BasicGoods7',
            component: () => import('@/views/basic/goods/Index.vue'),
            meta: {
                title: '七号档案'
            }
        },{
            path: '/basic/goods8',
            name: 'BasicGoods8',
            component: () => import('@/views/basic/goods/Index.vue'),
            meta: {
                title: '八号档案'
            }
        },{
            path: '/basic/goods9',
            name: 'BasicGoods9',
            component: () => import('@/views/basic/goods/Index.vue'),
            meta: {
                title: '九号档案'
            }
        },{
            path: '/basic/goods10',
            name: 'BasicGoods10',
            component: () => import('@/views/basic/goods/Index.vue'),
            meta: {
                title: '十号档案'
            }
        },{
            path: '/basic/goods11',
            name: 'BasicGoods11',
            component: () => import('@/views/basic/goods/Index.vue'),
            meta: {
                title: '十一号档案'
            }
        },{
            path: '/basic/goods12',
            name: 'BasicGoods12',
            component: () => import('@/views/basic/goods/Index.vue'),
            meta: {
                title: '十二号档案'
            }
        },{
            path: '/basic/goods13',
            name: 'BasicGoods13',
            component: () => import('@/views/basic/goods/Index.vue'),
            meta: {
                title: '十三号档案'
            }
        }]
    },
    {
        path: '/user',
        name: 'User',
        component: Layout,
        redirect: '/user/index',
        meta: {
            icon: 'el-icon-files',
            title: '用户管理'
        },
        children: [{
            path: '/user/index',
            name: 'UserManage',
            component: () => import('@/views/user/Index.vue'),
            meta: {
                title: '用户管理'
            }
        }]
    },
    {
        path: '/about',
        name: 'About',
        component: Layout,
        redirect: '/about/me',
        meta: {
            icon: 'el-icon-files',
            title: '关于'
        },
        children: [{
            path: '/about/me',
            name: 'AboutMe',
            component: () => import('@/views/About.vue'),
            meta: {
                title: '关于我'
            }
        }]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/Index.vue'),
        meta: {
            hidden: true
        }
    }
]