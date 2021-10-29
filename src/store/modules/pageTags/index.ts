import { Module } from 'vuex';
import { RouteRecordRaw } from "vue-router"
import IRootState from '@/store/interface';
import IPageTagsState, { IVisitedTag } from './interface';
const pageTagsModule: Module<IPageTagsState, IRootState> = {
    namespaced: true,
    state: {
        visitedTags: []
    },
    getters:{
        visitedTags:(state)=>state.visitedTags
    },
    mutations: {
        ADD_VISITED_TAGS: (state, view: RouteRecordRaw): void => {
            let flag: boolean = state.visitedTags.some(v => v.path === view.path);
            if (flag) return
            let visitedRoute = Object.assign({}, view, { title: view.meta?.title }) as IVisitedTag
            state.visitedTags.push(visitedRoute)
        },
        DEl_VISITED_TAG: (state, view: IVisitedTag): void => {
            for (const [i, v] of state.visitedTags.entries()) {
                if (v.path === view.path) {
                    state.visitedTags.splice(i, 1)
                    break
                }
            }
        },
        DEL_OTHER_VISITED_TAGS: (state, view: IVisitedTag) => {
            console.log(state, view, 'DEL_OTHER_VISITED_TAGS')
            state.visitedTags = state.visitedTags.filter(v => v.path === view.path)
        },
        DEL_RIGHT_VISITED_TAGS: (state, view: IVisitedTag) => {
            let index = state.visitedTags.findIndex(v => v.path === view.path);
            state.visitedTags.splice(index + 1)
        },
        //更新当前页签
        UPDATE_VISITED_TAG: (state, view: RouteRecordRaw): void => {

        }
    },
    actions: {
        addVisitedTags: ({ commit }, view) => {
            commit('ADD_VISITED_TAGS', view)
        },
        delVisitedTag: ({ commit }, view) => {
            commit('DEl_VISITED_TAG', view)
        },
        delOtherVisitedTags: ({ commit }, view) => {
            commit('DEL_OTHER_VISITED_TAGS', view)
        },
        delRightVisitedTags: ({ commit }, view) => {
            commit('DEL_RIGHT_VISITED_TAGS', view)
        },
        updateVisitedTag: ({ commit }, view) => {
            commit('UPDATE_VISITED_TAG', view)
        }
    }
}
export default pageTagsModule;