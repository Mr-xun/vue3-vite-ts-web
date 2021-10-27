import { RouterConfig } from "@/router/routes"
export type IVisitedTag = RouterConfig | {
    name: string,
    title: string,
    path: string,
}
export default interface IPageTagsState {
    visitedTags: Array<IVisitedTag>
}