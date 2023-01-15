<script setup lang="ts">
import { shallowRef, inject, watch, ShallowReactive } from "vue";
import { VueI18nTranslation } from "vue-i18n";
import { Notification, TreeNodeData } from "@arco-design/web-vue";

import { IConfig } from "./../types/config";
import { Data_fullTextSearchBlock, Data_getBlockBreadcrumb, ID } from "./../types/siyuan";

import { Tree, TreeNode } from "./../utils/tree";
import { SiyuanClient } from "./../utils/siyuan";

/* 查询结果 */
const config = inject("config") as IConfig; // 用户配置
const client = inject("client") as InstanceType<typeof SiyuanClient>; // 思源客户端
const results = inject("results") as ShallowReactive<Data_fullTextSearchBlock>; // 查询结果
const tree = inject("tree") as InstanceType<typeof Tree>; // 树状搜索结果
const expanded_keys = shallowRef<string[]>([]); // 展开的节点

/* 监听展开/折叠按钮 */
watch(
    [() => config.render.tree.fold, tree.signal],
    ([fold]) => {
        expanded_keys.value = fold ? [] : [...tree.map.keys()];
    },
    { immediate: true },
);

/* 加载块级节点 */
function load(node: TreeNodeData, $t: VueI18nTranslation): Promise<void> {
    return new Promise(resolve => {
        let blocks = results.blocks.filter(block => block.path.endsWith(node.key as string));
        if (blocks.length === 1 && blocks[0].children?.length > 0) blocks = blocks[0].children; // 若查询结果按文档分组, 则展开该文档的子节点
        Promise.all(
            blocks.map(
                block =>
                    new Promise((resolve, reject) => {
                        client
                            .getBlockBreadcrumb({
                                id: block.id,
                                excludeTypes: [],
                            })
                            .then(response => {
                                resolve(response.data);
                            })
                            .catch(reject);
                    }),
            ),
        )
            .then(breadcrumbs => {
                const keys = tree.updateBlocks(
                    node as TreeNode, // 文档节点
                    breadcrumbs as Data_getBlockBreadcrumb[][], // 每个块的面包屑
                    $t, // i10n 方法
                );
                expanded_keys.value.push(...keys);
                resolve();
            })
            .catch(reason => {
                console.warn(reason);
                Notification.error({
                    title: $t("search"),
                    content: String(reason),
                    closable: true,
                    duration: 3000,
                });
            });
        resolve();
    });
}

/* 选择节点 */
function select(selectedKeys: Array<string | number>, data: { selected?: boolean; selectedNodes: TreeNodeData[]; node?: TreeNodeData; e?: Event }): void {
    if (data.selected && selectedKeys.length === 1) {
        const id = /^(?<id>\d{14}-[0-9a-z]{7})/.exec(selectedKeys[0] as string)?.groups?.id;
        if (id) {
            window.open(`siyuan://blocks/${id}`, "_blank");
        }
    }
}
</script>

<template>
    <a-tab-pane
        class="panel"
        :key="2"
    >
        <!-- 标签页标题 -->
        <template #title>
            <icon-mind-mapping />
            {{ $t("label.search_results_tree") }}
        </template>

        <!-- 标签页内容 -->
        <!-- 滚动条 -->
        <a-scrollbar
            style="height: 100%; overflow: auto"
            outer-class="scrollbar-outer"
            type="track"
        >
            <!-- REF [Arco Design Vue](https://arco.design/vue/component/tree) -->
            <!-- 树 -->
            <a-tree
                v-if="tree.data.length > 0"
                size="mini"
                class="tree"
                :custom-wrap="config.render.breadcrumb.item.wrap"
                :data="tree.data"
                :show-line="true"
                :load-more="(node: TreeNodeData) => load(node, $t)"
                v-model:expanded-keys="expanded_keys"
                @select="select"
                block-node
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
    .scrollbar-outer {
        height: 100%;
        padding: 0 0.25em;

        .tree {
        }
    }
}
</style>
