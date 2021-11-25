import db from '@/utils/localstorage';

//存储token
export const setToken = (token: string) => db.save('TOKEN', token)

//获取token
export const getToken = () => db.get('TOKEN')

//清除token
export const removeToken = () => db.remove('TOKEN')