
export type {
    IBreadcrumbItem
};
export {
    Separator,
};

import { BreadcrumbRoute } from "@arco-design/web-vue";

/* 面包屑项 */
interface IBreadcrumbItem extends BreadcrumbRoute {
    separator: Separator,
}

/* 面包屑分隔符 */
enum Separator {
    notebook = "|",
    document = "/",
    block = ">",
}
