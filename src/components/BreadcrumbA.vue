<script setup lang="ts">
import { inject, Ref } from "vue";

import { IBreadcrumbItem, Separator } from "./../utils/breradcrumb";

// REF: [Props | Vue.js](https://cn.vuejs.org/guide/components/props.html)
const props = defineProps<{
    routes: IBreadcrumbItem[];
}>();

/* 将路由转换为超链接 href */
function paths2href(paths: string | string[]): string {
    return `siyuan://blocks/${typeof paths === "string" ? paths : paths.pop()}`;
}

const wrap_breadcrumb = inject("wrap_breadcrumb") as Ref<boolean>; // 面包屑换行
const wrap_breadcrumb_item = inject("wrap_breadcrumb_item") as Ref<boolean>; // 面包屑项换行
</script>

<template>
    <!-- REF [Arco Design Vue 参数化配置](https://arco.design/vue/component/breadcrumb#routes) -->
    <a-breadcrumb
        class="breadcrumb"
        :style="{
            flexWrap: wrap_breadcrumb ? 'wrap' : 'nowrap',
        }"
    >
        <a-breadcrumb-item
            v-for="(route, index) in props.routes"
            :key="index"
            :separator="route.separator"
        >
            <!-- eslint-disable vue/no-v-text-v-html-on-component -->
            <a-link
                class="link"
                :style="{
                    whiteSpace: wrap_breadcrumb_item ? 'normal' : 'nowrap',
                }"
                :href="paths2href(route.path)"
                :disabled="route.separator === Separator.notebook"
                v-html="route.label"
            ></a-link>
        </a-breadcrumb-item>
    </a-breadcrumb>
</template>

<style lang="less">
.breadcrumb {
    // REF: [css + div 常用的3种横向排列自动换行_css div自动换行_MoXinXueWEB的博客-CSDN博客](https://blog.csdn.net/MoXinXueWEB/article/details/126534696)
    // display: block;
    display: flex !important;
    margin-right: 0.5em;

    > .arco-breadcrumb-item {
        display: flex;

        &:last-child {
            a:not(:hover) {
                color: var(--color-text-1);
            }
        }

        .link {
            padding: 0;
            font-size: 12px;

            &.arco-link-disabled {
                color: var(--color-text-2);
                cursor: pointer;
            }

            .icon {
                display: inline-block;
                width: 1em;
                height: 1em;
                margin-right: 0.5em;

                &:is(img) {
                    // REF: [vertical-align - CSS（层叠样式表） | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/vertical-align)
                    vertical-align: middle;
                }
            }
        }
    }
}
</style>
