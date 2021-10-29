import { RouterConfig } from "@/router/routes"
export type IVisitedTag = RouterConfig & {
    title?: string,
}
export default interface IPageTagsState {
    visitedTags: Array<IVisitedTag>
}