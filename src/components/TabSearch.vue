<!-- REF [Arco Design Vue](https://arco.design/vue/component/tabs) -->
<script setup lang="ts">
import SearchResultsVue from "./SearchResults.vue";

import { inject, ShallowReactive } from "vue";

import { Data_fullTextSearchBlock } from "./../types/siyuan";

/* 查询结果 */
const results = inject('results') as ShallowReactive<Data_fullTextSearchBlock>; // 查询结果
</script>

<template>
    <a-tab-pane key="1">
        <!-- 标签页标题 -->
        <template #title>
            <a-popover position="bl">
                <icon-search /> {{ $t("search_result") }}

                <template #content>
                    <!-- REF [Arco Design Vue](https://arco.design/vue/component/descriptions) -->
                    <!-- 搜索结果信息 -->
                    <a-descriptions
                        size="mini"
                        bordered
                    >
                        <!-- 搜索结果文档数 -->
                        <a-descriptions-item :label="$t('search_description.doc_count')">
                            {{ results.matchedRootCount }}
                        </a-descriptions-item>

                        <!-- 搜索结果块数 -->
                        <a-descriptions-item :label="$t('search_description.block_count')">
                            {{ results.matchedBlockCount }}
                        </a-descriptions-item>
                    </a-descriptions>
                </template>
            </a-popover>
        </template>

        <!-- 标签页内容 -->
        <SearchResultsVue />
    </a-tab-pane>
</template>

<style scoped lang="less"></style>
