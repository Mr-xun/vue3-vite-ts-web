import TSettingState from "./modules/setting/interface"
import TPageTagsState from "./modules/pageTags/interface"
import TUserState from "./modules/user/interface"

export default interface IRootState {
    count: number,
    test?: any
}
export interface IAllState extends IRootState {
    setting: TSettingState,
    pageTags: TPageTagsState,
    user:TUserState
}