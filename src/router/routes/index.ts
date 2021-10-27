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
        redirect: '/home1',
        component: Layout,
        meta: {
            icon: 'el-icon-house',
            title: '首页'
        },
        children: [{
            path: '/home1',
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
        alwaysShow: true,
        meta: {
            icon: 'el-icon-files',
            title: '档案管理',
        },
        children: [{
            path: '/basic/goods',
            name: 'BasicGoods',
            component: () => import('@/views/basic/goods/Index.vue'),
            meta: {
                title: '一号档案'
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
]