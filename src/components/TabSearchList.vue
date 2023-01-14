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
            <a-popover position="bl">
                <icon-unordered-list />
                {{ $t("label.search_results_list") }}

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

                    <!-- REF [Arco Design Vue](https://arco.design/vue/component/divider) -->
                    <!-- 分割线 -->
                    <a-divider margin="0.5em" />

                    <!-- REF [Arco Design Vue](https://arco.design/vue/component/switch) -->
                    <!-- 搜索结果渲染样式控件 -->
                    <a-space class="tools">
                        <!-- 面包屑换行 -->
                        <a-tag bordered>
                            <!-- 标签图标 -->
                            <template #icon><icon-align-left /></template>

                            {{ $t("label.wrap_breadcrumb") }}
                            <a-switch
                                class="switch"
                                v-model="config.render.breadcrumb.wrap"
                                size="small"
                            />
                        </a-tag>

                        <!-- 面包屑项换行 -->
                        <a-tag bordered>
                            <!-- 标签图标 -->
                            <template #icon><icon-align-left /></template>

                            {{ $t("label.wrap_breadcrumb_item") }}
                            <a-switch
                                class="switch"
                                v-model="config.render.breadcrumb.item.wrap"
                                size="small"
                            />
                        </a-tag>
                    </a-space>
                </template>
            </a-popover>
        </template>

        <!-- 标签页内容 -->
        <!-- REF [Arco Design Vue](https://arco.design/vue/component/scrollbar) -->
        <!-- 滚动条 -->
        <a-scrollbar
            outer-class="scrollbar"
            type="track"
        >
            <search-results />
        </a-scrollbar>
    </a-tab-pane>
</template>

<style scoped lang="less">
.panel {
    .scrollbar {
        height: 100%;
        overflow: auto;
    }
}

.tools {
    flex-wrap: wrap;
    .switch {
        margin-left: 0.5em;
    }
}
</style>
