import request from '@/utils/request'
export default {
    testApi() {
        return request.get('/api/appoint/provider/service/index?serviceName=&serviceType=&serviceStatus=&pageNo=1&pageSize=20')
    },
    /*****************用户*******************************/
    user_login(params: { username: string, password: string }) {
        //登录
        return request.post('/user/login', params);
    },
    user_verify() {
        //验证是否登录
        return request.post('/user/verify');
    },

    user_list(params: ITableQuery) {
        //用户列表
        return request.get('/user/list', { params });
    },
}