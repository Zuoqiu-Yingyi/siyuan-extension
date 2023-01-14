<script setup lang="ts">
import BlockIcon from "./BlockIcon.vue";

import { inject } from "vue";

import { IBreadcrumbItem, Separator } from "../utils/breadcrumb";

import { IConfig } from "./../types/config";

// REF: [Props | Vue.js](https://cn.vuejs.org/guide/components/props.html)
const props = defineProps<{
    routes: IBreadcrumbItem[];
}>();

const config = inject("config") as IConfig; // 用户配置

/* 将路由转换为超链接 href */
function paths2href(paths: string | string[]): string {
    return `siyuan://blocks/${typeof paths === "string" ? paths : paths.pop()}`;
}
</script>

<template>
    <!-- REF [Arco Design Vue 参数化配置](https://arco.design/vue/component/breadcrumb#routes) -->
    <a-breadcrumb
        class="breadcrumb"
        :style="{
            flexWrap: config.render.breadcrumb.wrap ? 'wrap' : 'nowrap',
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
                    whiteSpace: config.render.breadcrumb.item.wrap ? 'normal' : 'nowrap',
                }"
                :href="paths2href(route.path)"
                :disabled="route.separator === Separator.notebook"
            >
                <block-icon
                    v-if="route.icon"
                    :type="route.type"
                    :subtype="route.subType"
                />

                <span
                    class="text"
                    v-if="route.label.length > 0"
                    v-html="route.label"
                ></span>
            </a-link>
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
            display: inline-flex;
            padding: 0 0.25em;
            font-size: 12px;

            outline: 1px solid var(--color-border-4);
            border-radius: 2px;

            &.arco-link-disabled {
                color: var(--color-text-2);
                cursor: pointer;
            }

            .text {
                &:not(:empty):not(:first-child) {
                    margin-left: 0.25em;
                }
            }
        }
    }
}
</style>
