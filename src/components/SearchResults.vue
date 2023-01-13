<!-- 搜索结果列表(未分组) -->
<script setup lang="ts">
import BreadcrumbPopover from "./BreadcrumbPopover.vue";

import { computed, inject, ShallowReactive } from "vue";
import { BreadcrumbRoute } from "@arco-design/web-vue";

import { INotebooks, Block_fullTextSearchBlock, Data_fullTextSearchBlock } from "../types/siyuan";

/* 查询结果 */
const results = inject("results") as ShallowReactive<Data_fullTextSearchBlock>; // 查询结果

/* 是否分组 */
const grouped = computed(() => {
    return results.blocks?.[0].children?.length > 0 ?? false;
});

/* 文档 */
const notebooks = inject("notebooks") as ShallowReactive<INotebooks>; // 笔记本列表

function doc2routes(doc: Block_fullTextSearchBlock): BreadcrumbRoute[] {
    const paths = doc.path.substring(0, doc.path.lastIndexOf(".")).split("/"); // 文档 ID 路径
    const hPath = doc.hPath.split("/"); // 可读路径
    hPath[0] = notebooks.map.get(doc.box)?.name as string; // 笔记名
    hPath[hPath.length - 1] = doc.content.toString(); // 当前文档名

    /* 路由 */
    const routes: BreadcrumbRoute[] = paths.map((path, index) => {
        return {
            path,
            label: hPath[index],
        };
    });

    return routes;
}

/* 块是否有 命名/别名/备注 */
function hasAttrs(block: Block_fullTextSearchBlock): boolean {
    return block.name.length + block.alias.length + block.memo.length > 0;
}

/* 关键词是否命中块命名/别名/备注 */
function isHit(block: Block_fullTextSearchBlock): boolean {
    return (
        block.content.search("<mark>") + // 命中文档标题
            block.name.search("<mark>") + // 命中命名
            block.alias.search("<mark>") + // 命中别名
            block.memo.search("<mark>") > // 命中备注
        -4
    );
}
</script>

<template>
    <a-list
        class="list"
        size="small"
        :data="results.blocks"
    >
        <template #empty>
            <a-empty :description="$t('help.search_empty')" />
        </template>
        <template #item="{ item, index }">
            <a-list-item
                class="list-item"
                :key="index"
                size="mini"
            >
                <a-collapse
                    v-if="grouped"
                    class="content"
                    :bordered="false"
                >
                    <a-collapse-item
                        class="collapse-item"
                        key="1"
                    >
                        <!-- 文档 -->
                        <template #header>
                            <breadcrumb-popover
                                :block="item"
                                :routes="doc2routes(item)"
                            />
                        </template>

                        <!-- 额外 -->
                        <template #extra>
                            <a-tooltip
                                position="br"
                                :content="$t('help.block_attrs_exist')"
                            >
                                <icon-info-circle v-show="hasAttrs(item)" />
                            </a-tooltip>

                            <a-tooltip
                                position="br"
                                :content="$t('help.search_march')"
                            >
                                <icon-search v-show="isHit(item)" />
                            </a-tooltip>
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
                <div
                    v-else
                    class="content"
                    v-html="item.content"
                ></div>
            </a-list-item>
        </template>
    </a-list>
</template>

<style lang="less">
.list {
    .list-item {
        padding: 0 !important;
        width: 100%;
        overflow-x: auto;
        scrollbar-width: none;
        &::-webkit-scrollbar {
            display: none;
        }

        .collapse-item {
            // 折叠面板标题
            > :first-child {
                background-color: var(--color-fill-1);

                border-color: var(--color-border-2);
                padding-top: 2px;
                padding-bottom: 2px;
                padding-right: 2px;
            }

            // 折叠面板内容
            > :last-child {
                background-color: transparent;
                padding: 0 0.5em;
            }
        }

        .icon {
            img {
                width: 18px;
                height: 18px;
                // REF: [CSS vertical-align 属性](https://www.w3school.com.cn/cssref/pr_pos_vertical-align.asp)
                vertical-align: text-bottom;
            }
        }
    }
}

.content,
.descriptions {
    mark {
        background-color: transparent;
        color: inherit;
        margin: 0 0.25em;
        padding: 0 0.25em;
        outline: 1px solid;
    }
}
</style>
