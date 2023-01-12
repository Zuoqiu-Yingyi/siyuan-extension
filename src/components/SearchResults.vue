<!-- 搜索结果列表(未分组) -->
<script setup lang="ts">
import DocBreadcrumbVue from "./DocBreadcrumb.vue";

import { inject, ShallowReactive, computed } from "vue";

import { Data_fullTextSearchBlock } from "./../types/siyuan";

/* 查询结果 */
const results = inject("results") as ShallowReactive<Data_fullTextSearchBlock>; // 查询结果

/* 是否分组 */
const grouped = computed(() => {
    return results.blocks?.[0].children?.length > 0 ?? false;
});
</script>

<template>
    <a-list
        class="list"
        size="small"
        :data="results.blocks"
    >
        <template #item="{ item, index }">
            <a-list-item
                class="list-item"
                :key="index"
                size="mini"
            >
                <a-collapse v-if="grouped">
                    <a-collapse-item
                        class="collapse-item"
                        key="1"
                    >
                        <!-- 文档 -->
                        <template #header>
                            <DocBreadcrumbVue :doc="item"/>
                        </template>

                        <!-- 块 -->
                        <a-list size="small">
                            <a-list-item
                                v-for="(block, i) in item.children"
                                :key="i"
                            >
                                <div
                                    class="content"
                                    v-html="block.content"
                                ></div>
                            </a-list-item>
                        </a-list>
                    </a-collapse-item>
                </a-collapse>
                <div
                    v-else
                    class="content"
                    v-html="item.content"
                ></div>
            </a-list-item>
        </template>
    </a-list>
</template>

<style lang="less">
.list {
    .list-item {
        padding: 0 !important;
        overflow-x: auto;

        .collapse-item {
            // 折叠面板标题
            > :first-child {
                background-color: var(--color-fill-1);

                border-color: var(--color-border-2);
                padding-top: 2px;
                padding-bottom: 2px;
            }

            // 折叠面板内容
            > :last-child {
                background-color: transparent;
                padding: 0 0.5em;
            }
        }

        .icon {
            img {
                width: 18px;
                height: 18px;
                // REF: [CSS vertical-align 属性](https://www.w3school.com.cn/cssref/pr_pos_vertical-align.asp)
                vertical-align: text-bottom;
            }
        }
    }

    .content {
        mark {
            background-color: transparent;
            color: inherit;
            margin: 0 0.25em;
            padding: 0 0.25em;
            outline: 1px solid;
        }
    }
}
</style>
