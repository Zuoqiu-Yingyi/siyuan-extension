<!-- 搜索结果列表(未分组) -->
<script setup lang="ts">
import BreadcrumbPopover from "./BreadcrumbPopover.vue";

import { computed, inject, reactive, shallowReactive, watch, ShallowReactive } from "vue";
import { VueI18nTranslation } from "vue-i18n";
import { Notification } from "@arco-design/web-vue";

import { INotebooks, Block_fullTextSearchBlock, Data_fullTextSearchBlock } from "./../types/siyuan";

import { SiyuanClient, BlockType, BlockSubType } from "./../utils/siyuan";
import { IBreadcrumbItem, Separator } from "./../utils/breradcrumb";

/* 查询结果 */
const results = inject("results") as ShallowReactive<Data_fullTextSearchBlock>; // 查询结果

/* 是否分组 */
const grouped = computed(() => results.blocks?.[0].children?.length > 0 ?? false);

/* 👇 分组 👇 */
/* 文档 */
const notebooks = inject("notebooks") as ShallowReactive<INotebooks>; // 笔记本列表

function doc2routes(doc: Block_fullTextSearchBlock): IBreadcrumbItem[] {
    const paths = doc.path.substring(0, doc.path.lastIndexOf(".")).split("/"); // 文档 ID 路径
    const hPath = doc.hPath.split("/"); // 可读路径
    hPath[0] = notebooks.map.get(doc.box)?.name as string; // 笔记名
    hPath[hPath.length - 1] = doc.content.toString(); // 当前文档名

    /* 路由 */
    const routes: IBreadcrumbItem[] = paths.map((path, index) => {
        return {
            path,
            label: hPath[index],
            separator: Separator.document,
            icon: false,
            type: BlockType.NodeNotebook,
            subType: BlockSubType.none,
        };
    });

    routes[0].label = `${notebooks.map.get(doc.box)?.icon ?? "📔"}${routes[0].label}`;
    routes[0].separator = Separator.notebook;

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

/* 块 */
const client = inject("client") as InstanceType<typeof SiyuanClient>; // 思源客户端

/* 渲染块面包屑 */
const rendered = reactive<boolean[]>([]); // 是否已渲染
const routes = shallowReactive<IBreadcrumbItem[][][]>([]); // 面包屑
watch(
    () => results.blocks,
    blocks => {
        for (let i = 0; i < blocks.length; ++i) {
            const doc = blocks[i];
            rendered[i] = false;
            routes[i] = [];

            for (let j = 0; j < doc.children?.length; ++j) {
                routes[i][j] = [];
            }
        }
    },
);

/* 渲染指定的列表 */
function change(index: number, $t: VueI18nTranslation): void {
    /* 已渲染 */
    if (rendered[index]) return;

    /* 没有块 */
    const blocks = results.blocks[index].children;
    if (blocks?.length === 0) return;

    // REF [Promise.all() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
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
                            const routes: IBreadcrumbItem[] = [];
                            if (response.data.length === 1 && response.data[0].type === BlockType.NodeDocument) {
                                const breadcrumb_item = response.data[0];
                                routes.push({
                                    path: breadcrumb_item.id,
                                    separator: Separator.block,
                                    icon: true,
                                    type: breadcrumb_item.type,
                                    subType: breadcrumb_item.subType,
                                    label: block.content,
                                });
                            } else {
                                for (let j = 1; j < response.data.length; ++j) {
                                    const breadcrumb_item = response.data[j];
                                    routes.push({
                                        path: breadcrumb_item.id,
                                        separator: Separator.block,
                                        icon: true,
                                        type: breadcrumb_item.type,
                                        subType: breadcrumb_item.subType,
                                        label: (() => {
                                            switch (breadcrumb_item.type) {
                                                case BlockType.NodeMathBlock:
                                                case BlockType.NodeTable:
                                                case BlockType.NodeCodeBlock:
                                                case BlockType.NodeHTMLBlock:
                                                case BlockType.NodeThematicBreak:
                                                case BlockType.NodeAudio:
                                                case BlockType.NodeVideo:
                                                case BlockType.NodeIFrame:
                                                case BlockType.NodeWidget:
                                                case BlockType.NodeBlockQueryEmbed:
                                                    return "";
                                                default:
                                                    return breadcrumb_item.name;
                                            }
                                        })(),
                                    });
                                }
                            }

                            resolve(routes);
                        })
                        .catch(reject);
                }),
        ),
    )
        .then(values => {
            routes[index] = values as IBreadcrumbItem[][];
            rendered[index] = true;
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
                <!-- 按文档分组 -->
                <a-collapse
                    v-if="grouped"
                    class="content"
                    :bordered="false"
                    @change="change(index, $t)"
                >
                    <a-collapse-item
                        class="collapse-item"
                        :key="1"
                    >
                        <!-- 文档 -->
                        <template #header>
                            <breadcrumb-popover
                                class="doc"
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
                        <a-list
                            v-if="rendered[index]"
                            class="blocks"
                            size="small"
                        >
                            <a-list-item
                                class="block"
                                v-for="(block, i) in item.children"
                                :key="i"
                            >
                                <breadcrumb-popover
                                    class="doc"
                                    :block="item"
                                    :routes="routes[index][i]"
                                />
                            </a-list-item>
                        </a-list>

                        <!-- REF [Arco Design Vue](https://arco.design/vue/component/skeleton) -->
                        <!-- 加载中的骨架屏 -->
                        <a-skeleton
                            v-else
                            :animation="true"
                        >
                            <a-skeleton-line :rows="1" />
                        </a-skeleton>
                    </a-collapse-item>
                </a-collapse>

                <!-- 未分组 -->
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

            // 块
            .blocks {
                padding: 0;
                .block {
                    padding: 0.25em 0.5em;
                }
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
