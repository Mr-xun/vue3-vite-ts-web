import { Module } from "vuex";
import TSettingState from './interface'
import IRootState from "@/store/interface";
const settingModule: Module<TSettingState, IRootState> = {
    namespaced: true,//命名空间
    state: {
        sidebarCollapse: false,//菜单栏折叠
    },
    mutations: {
        //更改菜单栏是否折叠
        toggleSidebar(state): void {
            state.sidebarCollapse = !state.sidebarCollapse
        }
    }
}
export default settingModule
