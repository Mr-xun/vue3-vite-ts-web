declare global {

    //拓展Math
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

    //接口响应
    interface IResponse<T = any> {
        code: number;
        msg: string;
        data: T;
    }

    //table渲染
    interface ITableRender<T = any> {
        loading: boolean
        data: Array<T>
        selection?:Array<T> //选中数据
        total: number
        page: number
        limit: number
    }

    //table查询
    interface ITableQuery {
        pageNum: number
        pageSize: number,
        [propName: string]: any;
    }
}
export { };