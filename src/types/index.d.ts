declare global {
    interface Math {
        easeInOutQuad(t: number, b: number, c: number, d: number): number;
    }
    interface Window {
        webkitRequestAnimationFrame: boolean,
        mozRequestAnimationFrame: boolean
    }
    interface parentNode {
        scrollTop:number
    }
}
export { };