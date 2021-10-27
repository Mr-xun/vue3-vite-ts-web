<template>
    <div class="page-tags-container">
        <el-scrollbar class="page-tags-wrapper">
            <ul class="page-tags-ul flex-left">
                <li
                    class="page-tags-item flex-cross-center"
                    v-for="(tag,index) in visitedTags"
                    :key="index"
                    @click="selectTag(tag)"
                >
                    <em
                        class="tags-item-status"
                        :class="{ 'tags-item-status__active': isActive(tag) }"
                    ></em>
                    <span class="tags-item-txt">{{ tag.title }}</span>
                    <el-icon class="tags-item-close">
                        <circle-close />
                    </el-icon>
                </li>
            </ul>
        </el-scrollbar>
    </div>
</template>
<script lang="ts" >
import { defineComponent, computed, watch } from 'vue'
import { CircleClose } from '@element-plus/icons'
import { RouterConfig } from "@/router/routes"

import { useRouter, useRoute } from 'vue-router'
import { useStore } from '@/store/index'
export default defineComponent({
    name: 'PageTags',
    components: { CircleClose },
    setup() {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const visitedTags = computed(() => store.state.pageTags.visitedTags)

        watch(() => route.path, () => addVisitedTag())
        //页签激活状态
        const isActive = (tag: RouterConfig): boolean => tag.path === route.path
        //选择页签
        const selectTag = (tag: RouterConfig): void => {
            router.push({
                path: tag.path
            })
        }
        //添加新的页签
        const addVisitedTag = () => {
            store.dispatch('pageTags/addVisitedTags', route)
        }
        return {
            visitedTags,
            isActive,
            selectTag
        }
    },
})
</script>
<style lang="scss" scoped>
.page-tags-container {
    height: 35px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #f1f1f1;
    .page-tags-wrapper {
        &::v-deep(.el-scrollbar__bar.is-horizontal) {
            height: 4px;
        }
    }
    .page-tags-item {
        position: relative;
        cursor: pointer;
        height: 34px;
        border-left: 1px solid #f1f1f1;
        color: #999;
        background: #fff;
        padding: 0 5px 0 15px;
        font-size: 13px;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        white-space: nowrap;
        .tags-item-status {
            display: inline-block;
            background: transparent !important;
            box-shadow: 0 0 7px transparent;
            display: inline-block;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            position: relative;
            margin-right: 6px;
            &__active {
                background: #85ef47 !important;
                box-shadow: 0 0 7px #b7eb8f;
            }
        }
        .tags-item-txt {
            margin-right: 2px;
        }
        .tags-item-close {
            color: #fff;
            width: 16px;
            font-size: 12px;
            font-weight: 600;
            border-radius: 50%;
            &:before {
                transform: scale(0.6);
                display: inline-block;
                vertical-align: -3px;
            }
        }
        &:hover {
            color: #495060;
            & .tags-item-close {
                font-size: 14px;
                font-weight: bold;
                color: red;
            }
        }
        &:last-of-type {
            border-right: 1px solid #f1f1f1;
        }
    }
}
</style>