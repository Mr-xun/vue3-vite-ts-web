import request from '@/utils/request'
export default {
    testApi(){
        console.log('axios')
        return request.get('/api/appoint/provider/service/index?serviceName=&serviceType=&serviceStatus=&pageNo=1&pageSize=20')
    }
}