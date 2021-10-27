<template>
    <el-container class="app-wrapper">
        <el-aside class="app-slide" :class="{ 'side-collpase': menuCollpase }">
            <sidebar class="sidebar-container" />
        </el-aside>
        <el-container class="app-main">
            <el-header class="head-container">
                <head-nav />
            </el-header>
            <el-main class="main-container">
                <view-content />
            </el-main>
        </el-container>
    </el-container>
</template>
<script  lang="ts">
import { defineComponent, computed } from 'vue'
import HeadNav from './components/HeadNav.vue'
import Sidebar from './components/sidebar/Index.vue'
import ViewContent from './components/ViewContent.vue'

import { useStore } from '@/store/index'
export default defineComponent({
    components: { Sidebar, HeadNav, ViewContent },
    setup() {
        const store = useStore();
        const menuCollpase = computed(() => store.state.setting.sidebarCollapse)
        return { menuCollpase }
    }

})
</script>
<style lang="scss">
.app-wrapper {
    height: 100%;
    .app-slide {
        width: 200px;
        transition: width 0.3s linear;
    }
    .side-collpase {
        width: 64px;
    }
    .head-container {
        height: auto;
        padding: 0 20px 0 0;
    }
    .main-container {
        padding: 0;
        overflow-x: hidden;
        /*  headbnav  50  */
        min-height: calc(100vh - 50px);
        width: 100%;
        position: relative;
        overflow: hidden;
        background: #f3f5f8;
        font-size: 0.88rem;
    }
}
</style>