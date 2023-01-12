<script setup lang="ts">
import BreadcrumbA from "./BreadcrumbA.vue";

import { computed } from "vue";
import { BreadcrumbRoute } from "@arco-design/web-vue";

import { Block_fullTextSearchBlock } from "../types/siyuan";

// REF: [Props | Vue.js](https://cn.vuejs.org/guide/components/props.html)
const props = defineProps<{
    block: Block_fullTextSearchBlock;
    routes: BreadcrumbRoute[];
}>();

/* 是否渲染块命名/别名/备注 (若非空) */
const render = computed(() => props.block.name.length + props.block.alias.length + props.block.memo.length > 0);
</script>

<template>
    <!-- 若块 命名/别名/备注 非空 -->
    <a-popover
        v-if="render"
        position="br"
    >
        <breadcrumb-a :routes="props.routes" />

        <template #content>
            <a-descriptions
                class="descriptions"
                size="mini"
                bordered
            >
                <!-- 命名 -->
                <a-descriptions-item :label="$t('name')">
                    <span v-html="props.block.name"></span>
                </a-descriptions-item>

                <!-- 别名 -->
                <a-descriptions-item :label="$t('alias')">
                    <span v-html="props.block.alias.replaceAll(/(?<!\\),/g, '\n').replace('\\,', ',')"></span>
                </a-descriptions-item>

                <!-- 备注 -->
                <a-descriptions-item :label="$t('memo')">
                    <span v-html="props.block.memo"></span>
                </a-descriptions-item>
            </a-descriptions>
        </template>
    </a-popover>

    <breadcrumb-a
        v-else
        :routes="routes"
    />
</template>

<style scoped lang="less"></style>
