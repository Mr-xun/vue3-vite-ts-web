<template>
    <el-scrollbar wrap-class="scrollbar-wrap" height="100vh">
        <el-menu
            :default-active="activeMenu"
            class="el-menu-vertical-demo"
            :collapse="sidebarCollapse"
            router
        >
            <sidebar-item v-for="(route) in menuRoutes" :key="route.path" :route="route" />
        </el-menu>
    </el-scrollbar>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import SidebarItem from "./SidebarItem.vue"
import { routes } from '@/router/routes'
import { useStore } from "@/store/index"
export default defineComponent({
    components: { SidebarItem },
    setup() {
        const route = useRoute()
        const store = useStore()
        const menuRoutes = computed(() => routes)
        const activeMenu = computed(() => {
            if (route.meta.activeMenu) {
                return route.meta.activeMenu
            }
            return route.path
        })
        const sidebarCollapse = computed(() => store.state.setting.sidebarCollapse)
        const changeRadio = ()=>{
            store.commit('setting/toggleSidebar')
        }
        return {
            sidebarCollapse,
            menuRoutes,
            activeMenu,
            changeRadio
        }
    }
})
</script>