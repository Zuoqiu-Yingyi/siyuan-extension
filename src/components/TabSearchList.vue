<!-- REF [Arco Design Vue](https://arco.design/vue/component/tabs) -->
<script setup lang="ts">
import SearchResults from "./SearchResults.vue";

import { inject, ShallowReactive } from "vue";

import { IConfig } from "../types/config";
import { Data_fullTextSearchBlock } from "../types/siyuan";

/* 查询结果 */
const config = inject("config") as IConfig; // 用户配置
const results = inject("results") as ShallowReactive<Data_fullTextSearchBlock>; // 查询结果
</script>

<template>
    <a-tab-pane
        class="panel"
        :key="1"
    >
        <!-- 标签页标题 -->
        <template #title>
            <icon-unordered-list />
            {{ $t("label.search_results_list") }}
        </template>

        <!-- 标签页内容 -->
        <!-- REF [Arco Design Vue](https://arco.design/vue/component/scrollbar) -->
        <!-- 滚动条 -->
        <a-scrollbar
            style="height: 100%; overflow: auto"
            outer-class="scrollbar-outer"
            type="track"
        >
            <search-results />
        </a-scrollbar>
    </a-tab-pane>
</template>

<style scoped lang="less">
.panel {
    .scrollbar-outer {
        height: 100%;
    }
}
</style>
