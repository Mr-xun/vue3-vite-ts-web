import request from '@/utils/request'

export default {
    testApi() {
        return request.get('/api/appoint/provider/service/index?serviceName=&serviceType=&serviceStatus=&pageNo=1&pageSize=20')
    },
    /**
     * 用户相关
     */
    //登录
    user_login(params: { username: string, password: string }) {
        return request.post('/user/login', params);
    },

    //登出
    user_logout() {
        return request.post('/user/logout');
    },

    //验证是否登录
    user_verify() {
        return request.post('/user/verify');
    },

    //用户列表
    user_list(params: ITableQuery) {
        return request.get('/user/list', { params });
    },

    //用户删除
    user_delete(deleteIds: string[]) {
        return request.delete(`/user/delete/${deleteIds}`);
    },
}