/**
 * tags右键菜单
 * by xunxiao 2021/1029
 */
import { computed, watch, reactive, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { IVisitedTag } from '@/store/modules/pageTags/interface'
import { useStore } from '@/store/index'
interface IRightMeunEl {
    visible: boolean,
    posLeft: string,
    posTop: string,
    tag: any,
    index: number
}
export default function contextMenu() {
    const currentInstance = getCurrentInstance()
    const $instanceProxy = currentInstance?.proxy; //当前组件实例 proxy
    const router = useRouter()
    const route = useRoute()

    const store = useStore()
    //右键操作菜单dom
    const rightMenuEl = reactive<IRightMeunEl>({
        visible: false,
        posLeft: "0px",
        posTop: "0px",
        tag: null,//右键点击选中tag
        index: 0
    })

    //页签激活状态
    const isActive = (tag: IVisitedTag): boolean => tag.path === route.path
    //页签list
    const visitedTags = computed(() => store.state.pageTags.visitedTags)
    //禁用右键操作
    const disableRightMenu = computed(() => store.state.pageTags.visitedTags.length === 1)
    //点击鼠标右键 展开操作菜单
    const openRightMenu = (contextTag: IVisitedTag, index: number, e: MouseEvent) => {
        if (disableRightMenu.value) return
        rightMenuEl.tag = contextTag;
        rightMenuEl.index = index;
        const $tagsContainerWidth: number = $instanceProxy?.$el.offsetWidth; //page-tags-container width
        const $tagsContainerLeft: number = $instanceProxy?.$el.getBoundingClientRect().left;//page-tags-container left 距离左侧距离
        const $tagsContainerTop: number = $instanceProxy?.$el.getBoundingClientRect().top;//page-tags-container top 距离顶部距离
        const meunWidth: number = 100 //右键菜单宽度
        const maxPosLeft: number = $tagsContainerWidth - meunWidth //距离左侧最大距离 防止点击右侧页签 右键菜单溢出屏幕
        let left: number = e.clientX - $tagsContainerLeft;
        if (left > maxPosLeft) {
            rightMenuEl.posLeft = maxPosLeft + 'px'
        } else {
            rightMenuEl.posLeft = left + 15 + 'px';
        }
        rightMenuEl.posTop = e.clientY - $tagsContainerTop + 5 + 'px';
        rightMenuEl.visible = true
    }
    //关闭操作菜单
    const closeRightMenu = () => {
        rightMenuEl.visible = false
    }

    //关闭一个页签
    const closeOneTag = (tag: IVisitedTag, index: number) => {
        store.dispatch('pageTags/delVisitedTag', tag)
        if (isActive(tag)) {
            jumpOtherTag(index)
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
    //前往其他页签
    const jumpOtherTag = (index: number) => {
        let nextVisitedTag = visitedTags.value[index]
        let preVisitedTag = visitedTags.value[index - 1]
        //删除后 如果后面有页签 则跳往下一个；否则 如果前面有页签  则跳往上一个
        if (nextVisitedTag) {
            router.push(nextVisitedTag)
        } else if (preVisitedTag) {
            router.push(preVisitedTag)
        }
    }
    watch(() => rightMenuEl.visible, (visible) => {
        if (visible) {
            document.addEventListener('click', closeRightMenu)
        } else {
            document.removeEventListener('click', closeRightMenu)
        }
    })
    return {
        disableRightMenu,
        rightMenuEl,
        closeRightMenu,
        openRightMenu,
        closeOneTag,
        closeOthersTags,
        closeRightRags,

    }
}