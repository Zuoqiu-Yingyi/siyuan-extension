<!-- REF [Arco Design Vue](https://arco.design/vue/component/tabs) -->
<script setup lang="ts">
import SearchResults from "./SearchResults.vue";
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
