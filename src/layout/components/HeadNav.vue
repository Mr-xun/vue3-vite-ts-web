<template>
    <div class="head-nav flex-between-center">
        <toggle class="toggle-container" @toggle="toggle" :isActive="sidebarCollapse" />
        <div class="right-menu-container flex-cross-center">
            <el-dropdown class="right-menu-item hover-effect">
                <span class="el-dropdown-link">
                    XunXiao
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>修改密码</el-dropdown-item>
                        <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store/index'
import { ElMessage } from 'element-plus'
import Toggle from "@/components/Toggle/index.vue"
export default defineComponent({
    components: { Toggle },
    setup() {
        const store = useStore()
        const router = useRouter()
        const sidebarCollapse = computed(() => store.state.setting.sidebarCollapse)
        const toggle = () => {
            store.commit('setting/toggleSidebar')
        }
        //退出登录
        const logout = async () => {
            let status = await store.dispatch('user/logout')
            if (status) {
                router.push({ path: '/login' })
                ElMessage.success('登出成功')
            }

        }
        return { sidebarCollapse, toggle, logout }
    },
})
</script>
<style lang="scss" >
.head-nav {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    border-bottom: 1px solid #f1f1f1;
    .toggle-container {
        height: 100%;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;
        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }
    .right-menu-container {
        height: 100%;
        .right-menu-item {
            height: 100%;
            cursor: pointer;
            padding: 0 8px;
            line-height: 50px;
        }
        .hover-effect {
            transition: background 0.3s;
            &:hover {
                background: rgba(0, 0, 0, 0.025);
            }
        }
    }
}
</style>