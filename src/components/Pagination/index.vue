<template>
    <div :class="{ 'hidden': hidden }" class="pagination-container">
        <el-pagination
            :background="background"
            v-model:currentPage="currentPage"
            v-model:pageSize="pageSize"
            :layout="layout"
            :page-sizes="pageSizes"
            :total="total"
            :small="small"
            v-bind="$attrs"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { scrollTo } from '@/utils/scroll-to';
interface IProps {
    small?: boolean,
    total: number,
    page?: number,
    limit?: number,
    pageSizes?: number[],
    layout?: string,
    background?: boolean,
    autoScroll?: boolean,
    hidden?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
    small: false,
    total: 0,
    page: 1,
    limit: 10,
    pageSizes: () => [5, 10, 20, 30, 50],
    layout: 'total, sizes, prev, pager, next, jumper',
    background: true,
    autoScroll: true,
    hidden: false

})
const emits = defineEmits<{
    (e: 'pagination', params: { page: number, limit: number }): void
    (e: 'update:page', page: number): void
    (e: 'update:limit', limit: number): void
}>()

const handleSizeChange = (val: number) => {
    emits('pagination', { page: currentPage.value, limit: val })
    if (props.autoScroll) {
        scrollTo(0, 800);
    }
}
const handleCurrentChange = (val: number) => {
    emits('pagination', { page: val, limit: pageSize.value })
    if (props.autoScroll) {
        scrollTo(0, 800);
    }
}
const currentPage = computed({
    get: () => props.page,
    set: val => emits('update:page', val)
})
const pageSize = computed({
    get: () => props.limit,
    set: val => emits('update:limit', val)
})


</script>

<style scoped>
.pagination-container {
    background: #fff;
    padding: 32px 16px 16px 0;
    margin-top: 0;
    text-align: right;
}
.pagination-container.hidden {
    display: none;
}
</style>
