<template>
    <el-scrollbar wrap-class="scroll-wrapper">
        <router-view v-slot="{ Component }" class="page-view">
            <transition name="fade-transform" mode="out-in">
                <keep-alive>
                    <component :is="Component" :key="$route.path" />
                </keep-alive>
            </transition>
        </router-view>
    </el-scrollbar>
</template>
<style lang="scss" scoped>
.page-view {
    margin: 10px;
    background: #fff;
    padding: 10px;
    border-radius: 5px;
}
</style>