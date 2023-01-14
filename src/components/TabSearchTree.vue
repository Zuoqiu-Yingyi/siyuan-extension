<script setup lang="ts">
import { inject, computed, ShallowReactive } from "vue";

import { IConfig } from "../types/config";
import { Data_fullTextSearchBlock } from "../types/siyuan";

import { Tree } from "./../utils/tree";

/* 查询结果 */
const config = inject("config") as IConfig; // 用户配置
const results = inject("results") as ShallowReactive<Data_fullTextSearchBlock>; // 查询结果
const tree = inject("tree") as InstanceType<typeof Tree>; // 树状搜索结果
const expanded_keys = computed(() => config.render.tree.fold ? [] : [...tree.map.keys()]); // 展开的节点
</script>

<template>
    <a-tab-pane
        class="panel"
        :key="2"
    >
        <!-- 标签页标题 -->
        <template #title>
            <a-popover position="bl">
                <icon-mind-mapping />
                {{ $t("label.search_results_tree") }}

                <template #content>
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

                    <!-- 分割线 -->
                    <a-divider margin="0.5em" />

                    <!-- 搜索结果渲染样式控件 -->
                    <a-space class="tools">
                        <!-- 展开 -->
                        <a-button
                            type="outline"
                            size="mini"
                            @click="config.render.tree.fold = false"
                        >
                            <template #icon>
                                <icon-expand />
                            </template>

                            {{ $t("label.unfold") }}
                        </a-button>

                        <!-- 折叠 -->
                        <a-button
                            type="outline"
                            size="mini"
                            @click="config.render.tree.fold = true"
                        >
                            <template #icon>
                                <icon-shrink />
                            </template>

                            {{ $t("label.fold") }}
                        </a-button>
                    </a-space>
                </template>
            </a-popover>
        </template>

        <!-- 标签页内容 -->
        <!-- 滚动条 -->
        <a-scrollbar
            outer-class="scrollbar"
            type="track"
        >
            <!-- REF [Arco Design Vue](https://arco.design/vue/component/tree) -->
            <!-- 树 -->
            <a-tree
                v-if="tree.data.length > 0"
                :data="tree.data"
                :show-line="true"
                v-model:expanded-keys="expanded_keys"
                blockNode
            />

            <a-empty
                v-else
                :description="$t('help.search_empty')"
            />
        </a-scrollbar>
    </a-tab-pane>
</template>

<style scoped lang="less">
.panel {
    .scrollbar {
        height: 100%;
        overflow: auto;
        padding: 0 0.5em;
    }
}
</style>
