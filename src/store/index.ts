import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import IRootState, { IAllState } from './interface'
import settingModule from './modules/setting'
import pageTagsModule from './modules/pageTags'
import userModule from './modules/user'

export const store = createStore<IRootState>({
    state: {
        count: 0
    },
    mutations: {
        increment(state) {
            state.count++
            console.log(state)
        }
    },
    modules: {
        setting: settingModule,
        pageTags: pageTagsModule,
        user:userModule
    }
})

// 定义自己的 `useStore` 组合式函数 避免使用userStore地方重复引用key
export const key: InjectionKey<Store<IAllState>> = Symbol('vuex')
export function useStore<T = IAllState>() {
    return baseUseStore<T>(key)
}