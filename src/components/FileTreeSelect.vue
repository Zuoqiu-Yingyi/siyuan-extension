<script setup lang="ts">
import { inject, ShallowReactive } from "vue";
import { useI18n } from "vue-i18n";
import { Notification, TreeNodeData } from "@arco-design/web-vue";

import { updateNotebooks, SiyuanClient } from "./../utils/siyuan";

import { INotebooks } from "./../types/siyuan";
import { IConfig } from "./../types/config";

import { DocTree } from "./../utils/doctree";
import { TreeNode } from "./../utils/tree";

const { t: $t } = useI18n();

const config = inject("config") as IConfig; // 用户配置
const client = inject("client") as InstanceType<typeof SiyuanClient>; // 客户端
const notebooks = inject("notebooks") as ShallowReactive<INotebooks>; // 笔记本列表

const doctree = new DocTree(notebooks); // 文档树对象

/* 动态加载文档树 */
async function onLoadMore(node: TreeNodeData): Promise<void> {}

/* 清空输入框 */
async function onclear(): Promise<void> {
    await updateNotebooks(notebooks, client);
    doctree.initRoots();
}

/* 搜索 */
async function onsearch(k: string): Promise<void> {
    if (k.length === 0) {
        await onclear();
    } else {
        try {
            const response = await client.searchDocs({ k });
            await updateNotebooks(notebooks, client);
            doctree.parseSearchDocs(response.data);
        } catch (error) {
            console.warn(error);
            Notification.error({
                title: $t("search"),
                content: String(error),
                closable: true,
                duration: 3000,
            });
        }
    }
}

/* 下拉列表展开状态更改 */
function onPopupVisibleChange(visible: boolean) {
    if (visible) updateNotebooks(notebooks, client);
}
</script>

<template>
    <a-tree-select
        dropdown-class-name="tree-select-dropdown"
        v-model:model-value="config.search.paths"
        :multiple="true"
        :data="doctree.data"
        :allow-clear="true"
        :allow-search="true"
        :placeholder="$t('search_config.path.placeholder')"
        :load-more="onLoadMore"
        :tree-props="{
            showLine: true,
        }"
        @clear="onclear"
        @search="onsearch"
        @popup-visible-change="onPopupVisibleChange"
    >
        <template #empty>
            <a-empty :description="$t('help.search_empty')" />
        </template>
        <template #tree-slot-icon="{ data }">
            <span
                class="node-icon"
                v-html="data?.icon"
            ></span>
        </template>
    </a-tree-select>
</template>

<style lang="less">
.tree-select-dropdown {
    .icon {
        width: 18px;
        height: 18px;
        // REF: [CSS vertical-align 属性](https://www.w3school.com.cn/cssref/pr_pos_vertical-align.asp)
        vertical-align: text-bottom;
    }
}
</style>
