<template>
    <div
        class="toggle flex-all-center"
        :class="{ 'is-active': !props.isActive }"
        @click="emits('toggle')"
    >
        <el-icon :size="20" color="#303133">
            <expand />
        </el-icon>
    </div>
</template>
<script setup lang="ts">
import { Expand } from '@element-plus/icons'
interface IProps {
    isActive: boolean
}
const props = withDefaults(defineProps<IProps>(), {
    isActive: false
})
const emits = defineEmits<{ (e: 'toggle'): void }>()
</script>
<style lang="scss" scoped>
.toggle {
    padding: 0 15px;
    cursor: pointer;
    .el-icon {
        transform: rotate(0);
        transition: all 0.3s linear;
    }
}
.toggle.is-active {
    .el-icon {
        transform: rotate(180deg);
    }
}
</style>