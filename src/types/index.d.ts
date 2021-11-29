declare global {
    interface Math {
        easeInOutQuad(t: number, b: number, c: number, d: number): number;
    }
    interface Window {
        webkitRequestAnimationFrame: boolean,
        mozRequestAnimationFrame: boolean
    }
    interface parentNode {
        scrollTop: number
    }
    interface ITableRender<T = any> {
        loading: boolean,
        data: Array<T>
        total: number
        page: number
        limit: number
    }
    interface ITableQuery {
        pageNum: number
        pageSize: number,
        [propName: string]: any;
    }
}
export { };