<template >
    <template
        v-if="onlyOneShowChild(route.children, route) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !route.meta?.alwaysShow"
    >
        <el-menu-item :index="resolvePath(onlyOneChild.path)">
            <i
                v-if="onlyOneChild.meta?.icon || route.meta?.icon"
                :class="onlyOneChild.meta.icon || route.meta?.icon"
            ></i>
            <template #title>{{ onlyOneChild.meta?.title }}</template>
        </el-menu-item>
    </template>
    <el-sub-menu v-else :index="resolvePath(route.path)" popper-append-to-body>
        <template #title>
            <i v-if="route.meta?.icon" :class="route.meta.icon"></i>
            <span>{{ route.meta?.title }}</span>
        </template>
        <sidebar-item
            v-for="(child,index) in filterRoutes(route.children)"
            :key="child.path + index"
            :route="child"
            :base-path="resolvePath(child.path)"
        />
    </el-sub-menu>
</template>
<script lang="ts">
import path from 'path';
import { defineComponent, PropType, ref } from 'vue'
import { RouterConfig } from "@/router/routes"
import { isExternal } from '@/utils/index'
export default defineComponent({
    name: 'SideBarItem',
    props: {
        route: {
            type: Object as PropType<RouterConfig>,
            default: () => {
                return {}
            }
        },
        basePath: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        let onlyOneChild = ref<any>(null)
        //只有一个孩子时展示
        const onlyOneShowChild = (children: Array<RouterConfig> = [], parent: any) => {
            let showChildren = children.filter(item => {
                if (item.meta?.hidden) {
                    return false
                } else {
                    onlyOneChild.value = item
                    return true
                }
            })
            // 当只有一个子路由时，将默认展示其子路由
            if (showChildren.length === 1) {
                return true
            }

            // 如果没有子路由则展示其父路由
            if (showChildren.length === 0) {
                onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
                return true
            }
            return false
        }
        const resolvePath = (routePath: string) => {
            if (isExternal(routePath)) {
                return routePath;
            }
            if (isExternal(props.basePath)) {
                return props.basePath;
            }

            return path.resolve(props.basePath, routePath);
        }
        //过滤路由
        const filterRoutes = (routes: Array<RouterConfig> = []) => (routes.filter(route => !route.meta?.hidde))
        return { onlyOneChild, onlyOneShowChild, resolvePath, filterRoutes }
    }
})
</script>