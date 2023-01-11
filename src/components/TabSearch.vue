<!-- REF [Arco Design Vue](https://arco.design/vue/component/tabs) -->
<script setup lang="ts">
import { ref } from "vue";

/* 搜索结果信息描述 */
const doc_count = ref(0); // 搜索结果文档数
const block_count = ref(0); // 搜索结果块数
</script>

<template>
    <a-tab-pane key="1">
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
                            {{ doc_count }}
                        </a-descriptions-item>

                        <!-- 搜索结果块数 -->
                        <a-descriptions-item :label="$t('search_description.block_count')">
                            {{ block_count }}
                        </a-descriptions-item>
                    </a-descriptions>
                </template>
            </a-popover>
        </template>
    </a-tab-pane>
</template>

<style scoped lang="less"></style>
