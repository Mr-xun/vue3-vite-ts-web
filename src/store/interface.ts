import TSettingState from "./modules/setting/interface"
export default interface IRootState {
    count: number,
    test?: any
}
export interface IAllState extends IRootState {
    setting: TSettingState
}