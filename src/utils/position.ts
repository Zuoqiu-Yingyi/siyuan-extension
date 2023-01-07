export type {
    IPosition,
};
export {
    Position,
};

interface IPosition {
    top: number; // 拖拽元素上方距离 (单位: px)
    bottom: number; // 拖拽元素下方距离 (单位: px)
    left: number; // 拖拽元素左侧距离 (单位: px)
    right: number; // 拖拽元素右侧距离 (单位: px)

    x: number; // 鼠标位置横坐标 (单位: px)
    y: number; // 鼠标位置纵坐标 (单位: px)
    centerX: number; // 拖拽元素中心横坐标 (单位: px)
    centerY: number; // 拖拽元素中心纵坐标 (单位: px)
    offsetX: number; // 鼠标位置相对于拖拽元素左上角的横向偏移量 (单位: px)
    offsetY: number; // 鼠标位置相对于拖拽元素左上角的纵向偏移量 (单位: px)
    update: (e: MouseEvent) => void; // 更新拖拽元素位置
}

class Position implements IPosition {
    top = 0;
    bottom = 0;
    left = 0;
    right = 0;
    x = 0;
    y = 0;
    centerX = 0;
    centerY = 0;
    offsetX = 0;
    offsetY = 0;

    update(e: MouseEvent) {
        this.x = e.x;
        this.y = e.y;
        this.offsetX = e.offsetY;
        this.offsetY = e.offsetY;

        this.top = e.y - e.offsetY;
        this.bottom = document.documentElement.clientHeight - (this.top + (e.target as HTMLElement).offsetHeight);
        this.left = e.x - e.offsetX;
        this.right = document.documentElement.clientWidth - (this.left + (e.target as HTMLElement).offsetWidth);

        this.centerX = this.left + (e.target as HTMLElement).offsetWidth / 2;
        this.centerY = this.top + (e.target as HTMLElement).offsetHeight / 2;
    }
}
