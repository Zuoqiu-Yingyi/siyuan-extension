<script setup lang="ts">
import { inject, ShallowReactive } from "vue";
import { BreadcrumbRoute } from "@arco-design/web-vue";

import { INotebooks, Block_fullTextSearchBlock } from "./../types/siyuan";

// REF: [Props | Vue.js](https://cn.vuejs.org/guide/components/props.html)
const props = defineProps<{
    doc: Block_fullTextSearchBlock;
}>();

const notebooks = inject("notebooks") as ShallowReactive<INotebooks>; // 笔记本列表
const paths = props.doc.path.substring(0, props.doc.path.lastIndexOf(".")).split("/"); // 文档 ID 路径
const hPath = props.doc.hPath.split("/"); // 可读路径
hPath[0] = notebooks.map.get(props.doc.box)?.name as string; // 笔记名

/* 路由 */
const routes: BreadcrumbRoute[] = paths.map((path, index) => {
    return {
        path,
        label: hPath[index],
    };
});
// routes.push({
//     path: "",
//     label: "",
// });

/* 将路由转换为超链接 href */
function paths2href(paths: string[]): string {
    return `siyuan://blocks/${paths.pop()}`;
}
</script>

<template>
    <!-- REF [Arco Design Vue 参数化配置](https://arco.design/vue/component/breadcrumb#routes) -->
    <a-breadcrumb
        class="breadcrumb"
        :routes="routes"
    >
        <!-- 使用插槽可以为最后一个面包屑项设置超链接 -->
        <template #item-render="{ route, paths }">
            <a-link :href="paths2href(paths)">
                {{ route.label }}
            </a-link>
        </template>
    </a-breadcrumb>
</template>

<style lang="less">
.breadcrumb {
    // REF: [css + div 常用的3种横向排列自动换行_css div自动换行_MoXinXueWEB的博客-CSDN博客](https://blog.csdn.net/MoXinXueWEB/article/details/126534696)
    // display: block;

    display: flex;
    flex-wrap: wrap;

    > .arco-breadcrumb-item {
        padding: 0;

        &:last-child {
            a:not(:hover) {
                color: var(--color-text-1);
            }
        }

        a {
            padding: 0;
            font-size: 12px;
        }
    }
}
</style>
