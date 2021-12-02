
export interface ITableRenderList {
    avatar: string,
    username: string,
    mobile: string,
    role?: number | null,
    _id?: string
}
export interface ISubmitForm extends ITableRenderList {
    password: string
}