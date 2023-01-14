
export type {
    IBreadcrumbItem
};
export {
    Separator,
};

import { BreadcrumbRoute } from "@arco-design/web-vue";
import { BlockType, BlockSubType } from "./siyuan";

/* 面包屑项 */
interface IBreadcrumbItem extends BreadcrumbRoute {
    separator: Separator,
    icon: boolean,
    type: BlockType,
    subType: BlockSubType,
}

/* 面包屑分隔符 */
enum Separator {
    notebook = "|",
    document = "/",
    block = ">",
}
