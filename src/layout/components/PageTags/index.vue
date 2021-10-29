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
                        @click.prevent.stop="closeOneTag(tag, index)"
                    >
                        <circle-close />
                    </el-icon>
                </li>
            </ul>
        </el-scrollbar>
        <div
            class="contextmenu-wrapper"
            v-show="rightMenu.visible"
            :style="{
                'top': rightMenu.posTop,
                'left': rightMenu.posLeft
            }"
        >
            <div class="contextmenu-item" @click="closeOneTag(rightMenu.tag, rightMenu.index)">关闭当前</div>
            <div class="contextmenu-item" @click="closeOthersTags(rightMenu.tag)">关闭其他</div>
            <div class="contextmenu-item" @click="closeRightRags(rightMenu.tag)">关闭右侧</div>
        </div>
    </div>
</template>
<script lang="ts" >
import { defineComponent, computed, watch, reactive, onMounted, getCurrentInstance, ref } from 'vue'
import { CircleClose } from '@element-plus/icons'
import { IVisitedTag } from '@/store/modules/pageTags/interface'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '@/store/index'
interface IRightMeun {
    visible: boolean,
    posLeft: string,
    posTop: string,
    tag: IVisitedTag | null,
    index: number
}
export default defineComponent({
    name: 'PageTags',
    components: { CircleClose },
    setup() {
        const currentInstance = getCurrentInstance()
        const $instanceProxy = currentInstance?.proxy; //当前组件实例 proxy
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const refTags = ref([])
        onMounted(() => {
            addVisitedTag()
        })
        //页签list
        const visitedTags = computed(() => store.state.pageTags.visitedTags)
        //禁用右键操作
        const disableRightMenu = computed(() => store.state.pageTags.visitedTags.length === 1)
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
        //关闭一个页签
        const closeOneTag = (tag: IVisitedTag, index: number) => {
            store.dispatch('pageTags/delVisitedTag', tag)
            closeRightMenu()
            if (isActive(tag)) {
                jumpOtherTag(tag, index)
            }
        }
        //前往其他页签
        const jumpOtherTag = (tag: IVisitedTag, index: number) => {
            let nextVisitedTag = visitedTags.value[index]
            let preVisitedTag = visitedTags.value[index - 1]
            //删除后 如果后面有页签 则跳往下一个；否则 如果前面有页签  则跳往上一个
            if (nextVisitedTag) {
                router.push(nextVisitedTag)
            } else if (preVisitedTag) {
                router.push(preVisitedTag)
            }
        }
        //关闭其它页签
        const closeOthersTags = (tag: IVisitedTag) => {
            router.push(tag)
            store.dispatch('pageTags/delOtherVisitedTags', tag)
        }
        //关闭右侧页签
        const closeRightRags = (tag: IVisitedTag) => {
            router.push(tag)
            store.dispatch('pageTags/delRightVisitedTags', tag)
        }
        //浏览中页签移动至中间位置
        const moveToVisitingTag = () => {
            $instanceProxy?.$nextTick(() => {
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

        //右键操作菜单
        const rightMenu = reactive<IRightMeun>({
            visible: false,
            posLeft: "0px",
            posTop: "0px",
            tag: null,//右键点击选中tag
            index: 0
        })
        //点击鼠标右键 展开操作菜单
        const openRightMenu = (contextTag: IVisitedTag, index: number, e: MouseEvent) => {
            moveToVisitingTag()
            if (disableRightMenu.value) return
            rightMenu.tag = contextTag;
            rightMenu.index = index;
            const $tagsContainerWidth: number = $instanceProxy?.$el.offsetWidth; //page-tags-container width
            const $tagsContainerLeft: number = $instanceProxy?.$el.getBoundingClientRect().left;//page-tags-container left 距离左侧距离
            const $tagsContainerTop: number = $instanceProxy?.$el.getBoundingClientRect().top;//page-tags-container top 距离顶部距离
            const meunWidth: number = 100 //右键菜单宽度
            const maxPosLeft: number = $tagsContainerWidth - meunWidth //距离左侧最大距离 防止点击右侧页签 右键菜单溢出屏幕
            let left: number = e.clientX - $tagsContainerLeft;
            if (left > maxPosLeft) {
                rightMenu.posLeft = maxPosLeft + 'px'
            } else {
                rightMenu.posLeft = left + 15 + 'px';
            }
            rightMenu.posTop = e.clientY - $tagsContainerTop + 5 + 'px';
            rightMenu.visible = true
        }
        //关闭操作菜单
        const closeRightMenu = () => {
            rightMenu.visible = false
        }
        watch(() => rightMenu.visible, (visible) => {
            if (visible) {
                document.addEventListener('click', closeRightMenu)
            } else {
                document.removeEventListener('click', closeRightMenu)
            }
        })

        //添加新的页签
        const addVisitedTag = () => {
            store.dispatch('pageTags/addVisitedTags', route)
        }
        return {
            disableRightMenu,
            visitedTags,
            rightMenu,
            refTags,
            isActive,
            changeVisitingTag,
            closeOneTag,
            closeOthersTags,
            closeRightRags,
            openRightMenu
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