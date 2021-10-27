import { Module } from 'vuex';
import { RouteRecordRaw } from "vue-router"
import IRootState from '@/store/interface';
import IPageTagsState from './interface';
const pageTagsModule: Module<IPageTagsState, IRootState> = {
    namespaced: true,
    state: {
        visitedTags: []
    },
    mutations: {
        ADD_VISITED_TAGS: (state, view: RouteRecordRaw | RouteRecordRaw): void => {
            let flag: boolean = state.visitedTags.some(v => v.path === view.path);
            if (flag) return
            let visitedRoute = Object.assign({}, view, { title: view.meta?.title })
            state.visitedTags.push(visitedRoute)
        },
        //更新当前页签
        UPDATE_VISITED_TAG: (state, view: RouteRecordRaw | RouteRecordRaw): void => {

        }
    },
    actions: {
        addVisitedTags: ({ commit }, view) => {
            commit('ADD_VISITED_TAGS', view)
        },
        updateVisitedTag: ({ commit }, view) => {
            commit('UPDATE_VISITED_TAG', view)
        }
    }
}
export default pageTagsModule;