<script setup lang="ts">
import { BreadcrumbRoute } from "@arco-design/web-vue";

// REF: [Props | Vue.js](https://cn.vuejs.org/guide/components/props.html)
const props = defineProps<{
    routes: BreadcrumbRoute[],
}>();

/* 将路由转换为超链接 href */
function paths2href(paths: string[]): string {
    return `siyuan://blocks/${paths.pop()}`;
}
</script>

<template>
    <!-- REF [Arco Design Vue 参数化配置](https://arco.design/vue/component/breadcrumb#routes) -->
    <a-breadcrumb
        class="breadcrumb"
        :routes="props.routes"
    >
        <!-- 使用插槽可以为最后一个面包屑项设置超链接 -->
        <template #item-render="{ route, paths }">
            <!-- eslint-disable vue/no-v-text-v-html-on-component -->
            <a-link
                :href="paths2href(paths)"
                v-html="route.label"
            ></a-link>
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
