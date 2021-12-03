
export interface ITableRenderList {
    avatar: string,
    username: string,
    mobile: string,
    role?: number | null,
    user_id?: string
}
export interface ISubmitForm extends ITableRenderList {
    password: string
}