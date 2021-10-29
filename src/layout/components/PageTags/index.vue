<template>
    <div class="page-tags-container">
        <el-scrollbar class="page-tags-wrapper" wrap-class="tags-scroll-wrap">
            <ul class="page-tags-ul flex-left">
                <li
                    class="page-tags-item flex-cross-center"
                    v-for="(tag,index) in visitedTags"
                    :ref="el => { if (el) refTags[index] = el }"
                    :data-path="tag.path"
                    :key="index"
                    @click="changeVisitingTag(tag)"
                    @contextmenu.prevent="openRightMenu(tag, index, $event)"
                >
                    <em
                        class="tags-item-status"
                        :class="{ 'tags-item-status__active': isActive(tag) }"
                    ></em>
                    <span class="tags-item-txt">{{ tag.title }}</span>
                    <el-icon
                        v-if="!disableRightMenu"
                        class="tags-item-close"
                        @click.prevent.stop="closeOneTag(tag, index), closeRightMenu()"
                    >
                        <circle-close />
                    </el-icon>
                </li>
            </ul>
        </el-scrollbar>
        <div
            class="contextmenu-wrapper"
            v-show="rightMenuEl.visible"
            :style="{
                'top': rightMenuEl.posTop,
                'left': rightMenuEl.posLeft
            }"
        >
            <div
                class="contextmenu-item"
                @click="closeOneTag(rightMenuEl.tag, rightMenuEl.index)"
            >关闭当前</div>
            <div class="contextmenu-item" @click="closeOthersTags(rightMenuEl.tag)">关闭其他</div>
            <div class="contextmenu-item" @click="closeRightRags(rightMenuEl.tag)">关闭右侧</div>
        </div>
    </div>
</template>
<script lang="ts" >
import { defineComponent, computed, watch, onMounted, getCurrentInstance, ref, nextTick } from 'vue'
import { CircleClose } from '@element-plus/icons'
import { IVisitedTag } from '@/store/modules/pageTags/interface'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '@/store/index'
import contextMenu from './composables/contextMenu'
export default defineComponent({
    name: 'PageTags',
    components: { CircleClose },
    setup() {
        const currentInstance = getCurrentInstance()
        const $instanceProxy = currentInstance?.proxy; //当前组件实例 proxy
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const refTags = ref<any>([])
        onMounted(() => {
            addVisitedTag()
        })
        //页签list
        const visitedTags = computed(() => store.state.pageTags.visitedTags)
        watch(() => route.path, () => {
            addVisitedTag();
            moveToVisitingTag()
        })
        //页签激活状态
        const isActive = (tag: IVisitedTag): boolean => tag.path === route.path

        //切换预览页签
        const changeVisitingTag = (tag: IVisitedTag) => {
            router.push({
                path: tag.path
            })
        }
        //浏览中页签移动至中间位置
        const moveToVisitingTag = () => {
            nextTick(() => {
                var el: HTMLElement
                var i: number
                for ([i, el] of refTags.value.entries()) {
                    if (el.dataset.path === route.path) {
                        const $tagsScrollWrap = document.getElementsByClassName('tags-scroll-wrap')[0] //scroll dom
                        const $tagsContainerWidth: number = $instanceProxy?.$el.offsetWidth; //page-tags-container width
                        const $tagsContainerLeft: number = $instanceProxy?.$el.getBoundingClientRect().left;//page-tags-container left 距离左侧距离
                        const $tagsContainerRightDist: number = $tagsContainerWidth + $tagsContainerLeft;//page-tags-container right边界 距离左侧距离

                        const $activeTagWidth = el.offsetWidth; //active-tag dom width
                        const $activeTagOffsetLeft = el.offsetLeft; //active-tag dom offsetLeft
                        const $activeTagLeft = el.getBoundingClientRect().left;  //active-tag 距离左侧距离
                        const $activeTagBehindDist = $tagsContainerRightDist - ($activeTagLeft + $activeTagWidth)//acitve-tag 与page-tags-container后(右)边距的距离
                        const $activeTagFrontDist = $activeTagLeft - $tagsContainerLeft//acitve-tag 与page-tags-container前(左)边距的距离

                        const $nextTag: HTMLElement = refTags.value[i + 1] // active-tag的下一个tag 
                        const $nextTagWidth = $nextTag?.offsetWidth ?? 0;
                        const $nextTagOffsetLeft = $nextTag?.offsetLeft ?? 0;

                        const $preTag: HTMLElement = refTags.value[i - 1];// active-tag的前一个tag 
                        const $preTagWidth = $preTag?.offsetWidth ?? 0;
                        const $preTagOffsetLeft = $preTag?.offsetLeft ?? 0;
                        //如果切换路由 active-tag 距离左则或距离右侧距离<=0  先滚动至active-tag 位置（针对切换至第一个或最后一个处理）
                        if ($activeTagFrontDist <= 0 || $activeTagBehindDist <= 0) {
                            $tagsScrollWrap.scrollTo({
                                left: $activeTagOffsetLeft,
                                behavior: "smooth"
                            });
                        }
                        if ($nextTag && $activeTagBehindDist < $nextTagWidth) {
                            //如果active-tag 距离右边距离小于 active-next-tag  自动滚动至active-next-tag位置
                            const moveDist = $nextTagOffsetLeft - $tagsContainerWidth + $nextTagWidth
                            $tagsScrollWrap.scrollTo({
                                left: moveDist,
                                behavior: "smooth"
                            });
                        } else if ($preTag && $activeTagFrontDist < $preTagWidth) {
                            //如果active-tag 距离左边距离小于 active-pre-tag  自动滚动至active-pre-tag位置
                            const moveDist = $preTagOffsetLeft
                            $tagsScrollWrap.scrollTo({
                                left: moveDist,
                                behavior: "smooth"
                            });
                        }
                    }
                }
            })
        }
        
        //添加新的页签
        const addVisitedTag = () => {
            store.dispatch('pageTags/addVisitedTags', route)
        }
        return {
            visitedTags,
            refTags,
            isActive,
            changeVisitingTag,
            ...contextMenu()
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
    position: relative;
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
    .contextmenu-wrapper {
        position: absolute;
        z-index: 9999;
        background: #fff;
        list-style-type: none;
        margin: 0;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 13px;
        font-weight: 400;
        color: #333;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        min-width: 100px;
        .contextmenu-item {
            margin: 0;
            padding: 7px 20px;
            cursor: pointer;
            text-align: center;
            &:hover {
                background-color: #e8f4ff;
                color: #46a6ff;
            }
        }
    }
}
</style>