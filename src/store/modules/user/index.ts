import { Module } from "vuex";
import IUserState from './interface'
import IRootState from "@/store/interface";
import db from '@/utils/localstorage';
import api from '@/api'
interface ILoginForm {
    username: string,
    password: string
}
const userModule: Module<IUserState, IRootState> = {
    namespaced: true,
    state: {
        token: db.get('TOKEN'),
        userInfo: null
    },
    mutations: {
        setToken(state, token: string): void {
            state.token = token
            db.save('TOEKN', token)
        },
        setUser(state, data: object): void {
            db.save('USER_INFO', data);
            state.userInfo = data;
        },
    },
    actions: {
        async login({ commit }, params: ILoginForm) {
            try {
                let { data } = await api.user_login(params)
                commit('setToken', data.token)
                commit('setUser', data.userInfo)
                return true
            } catch (error) {
                console.log(error)
                return false

            }
        },
        async logout({ commit }) {
            try {
                await api.user_logout()
                commit('setToken', '')
                commit('setUser', null)
                db.clear()
                return true
            } catch (error) {
                console.log(error)
                return false
            }
        }
    }
}
export default userModule