<!-- 搜索结果列表(未分组) -->
<script setup lang="ts">
import { inject, ShallowReactive, computed } from "vue";

import { INotebooks, Data_fullTextSearchBlock } from "./../types/siyuan";

/* 查询结果 */
const results = inject("results") as ShallowReactive<Data_fullTextSearchBlock>; // 查询结果
const notebooks = inject("notebooks") as ShallowReactive<INotebooks>; // 笔记本列表

/* 是否分组 */
const grouped = computed(() => {
    console.log(notebooks.map);
    return results.blocks?.[0].children?.length > 0 ?? false;
});
</script>

<template>
    <a-list
        id="searchResultsList"
        size="small"
        :virtualListProps="{
            height: '100%',
            fixedSize: true,
        }"
        :data="results.blocks"
    >
        <template #item="{ item, index }">
            <a-list-item
                :key="index"
                size="mini"
            >
                <a-collapse v-if="grouped">
                    <a-collapse-item key="1">
                        <!-- 文档 -->
                        <template #header>
                            {{ `${notebooks.map.get(item.box)?.name ?? $t("notebook") }${item.hPath}` }}
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
            </a-list-item>
        </template>
    </a-list>
</template>

<style lang="less">
#searchResultsList {
    overflow: auto;
    height: 100%;

    .arco-scrollbar {
        &,
        > .arco-list {
            &,
            > .arco-list-content-wrapper {
                height: 100%;
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
</style>
