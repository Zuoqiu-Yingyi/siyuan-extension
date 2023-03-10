<script setup lang="ts">
import TabSearchList from "./TabSearchList.vue";
import TabSearchTree from "./TabSearchTree.vue";
import TabSettings from "./TabSettings.vue";

import { ref, toRaw, inject, watch, provide, Ref, ShallowReactive, onBeforeMount, unref } from "vue";
import { useI18n } from "vue-i18n";
import { Notification } from "@arco-design/web-vue";
import { Storage } from "webextension-polyfill";

import { IConfig } from "./../types/config";
import { browser } from "./../utils/browser";
import { IPreview } from "./../types/preview";
import { INotebooks, Data_fullTextSearchBlock } from "./../types/siyuan";

import { Status, map } from "./../utils/status";
import { Method, updateNotebooks, SiyuanClient } from "./../utils/siyuan";
import { Tree } from "./../utils/tree";

import { Engine } from "../engine/Engine";

const { t: $t } = useI18n();

const status = inject("status") as Ref<Status>; // 连接状态
const message = inject("message") as Ref<string>; // 连接状态消息
const version = inject("version") as Ref<string>; // 内核版本
const visible = inject("visible") as Ref<boolean>; // 是否显示
const config = inject("config") as IConfig; // 用户配置
const preview = inject("preview") as ShallowReactive<IPreview>; // 预览
const tree = inject("tree") as InstanceType<typeof Tree>; // 树状搜索结果

function handleOk() {
    visible.value = false;
}
function handleCancel() {
    visible.value = false;
}

/* 👇 查询内容 👇 */
const query = ref(""); // 查询语句
const keywords = ref<string[]>([]); // 查询关键词
const results = inject("results") as Data_fullTextSearchBlock; // 查询结果

/* 将关键字列表转换为查询语句 */
function keywords2query(value: string[]): string {
    return value.join(" ");
}

/* 查询关键词 => 查询语句 */
watch(keywords, value => {
    query.value = keywords2query(value);
});

const client = inject("client") as InstanceType<typeof SiyuanClient>; // 客户端
const notebooks = inject("notebooks") as ShallowReactive<INotebooks>; // 笔记本列表

/* 搜索 */
async function search(keyword: boolean) {
    try {
        const q = keyword ? keywords2query(keywords.value) : query.value;
        if (q.length === 0) {
            results.blocks = [];
            results.matchedBlockCount = 0;
            results.matchedRootCount = 0;
            return;
        }

        await updateNotebooks(notebooks, client);

        // REF [响应式 API：进阶 toRay() | Vue.js](https://cn.vuejs.org/api/reactivity-advanced.html#toraw)
        // REF [响应式 API：工具函数 unref() | Vue.js](https://cn.vuejs.org/api/reactivity-utilities.html#unref)
        const payload = Object.assign({}, toRaw(config.search), {
            query: q,
        });

        const response = await client.fullTextSearchBlock(payload);

        results.blocks = response.data.blocks;
        results.matchedRootCount = response.data.matchedRootCount;
        results.matchedBlockCount = response.data.matchedBlockCount;

        /* 是否自动展开抽屉 */
        if (
            !visible.value && // 当前未展开
            config.other.open && // 开启自动展开
            results.matchedBlockCount > 0 // 搜索结果数量非空
        ) {
            visible.value = true;
        }
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

provide("keywords", keywords);

// 初始化后再执行
onBeforeMount(() => {
    /* 浏览器扩展环境 */
    if (import.meta.env.PROD) {
        const loaded = inject("loaded") as Ref<boolean>; // 是否加载完成

        const stop = watch(loaded, loaded => {
            if (loaded) {
                /* 关联搜索引擎 */
                const engine = new Engine(q => {
                    query.value = q;
                    keywords.value = q.trim().split(/\s+/);

                    search(config.search.method === Method.keyword);
                });

                provide("engine", engine);
                stop(); // 停止监听
            }
        });
    }
});
/* 👆 查询内容 👆 */

/* 👇 当前标签页 👇 */
const tab = ref(1); // 当前激活的标签页

/* 浏览器扩展环境 */
if (import.meta.env.PROD) {
    /* 从储存中读取悬浮球位置 */
    browser.storage.local
        .get({
            tab: unref(tab),
        })
        .then(items => {
            if (tab.value !== items.tab) tab.value = items.tab;
        });

    /* 监听悬浮球位置更改 */
    browser.storage.local.onChanged.addListener((changes: Storage.StorageAreaOnChangedChangesType) => {
        if (changes.tab) {
            if (tab.value !== changes.tab.newValue) tab.value = changes.tab.newValue;
        }
    });
}

function tabsOnChange(key: number | string) {
    /* 浏览器扩展环境 */
    if (import.meta.env.PROD) {
        browser.storage.local.set({
            tab: key,
        });
    }
}

provide("tab", tab);
/* 👆 当前标签页 👆 */
</script>

<template>
    <!-- REF [Arco Design Vue](https://arco.design/vue/component/drawer) -->
    <a-drawer
        id="siyuan-drawer"
        :visible="visible"
        :mask="false"
        @ok="handleOk"
        @cancel="handleCancel"
        unmountOnClose
    >
        <template #title>
            <div class="title">
                <a-popover position="bl">
                    <img
                        class="title-icon"
                        src="./../assets/siyuan-32.png"
                    />

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
                            <!-- 预览聚焦 -->
                            <a-tag bordered>
                                <!-- 标签图标 -->
                                <template #icon><icon-eye /></template>

                                {{ $t("label.preview_focus") }}
                                <a-switch
                                    class="switch"
                                    v-model:model-value="preview.focus"
                                    size="small"
                                />
                            </a-tag>

                            <!-- 面包屑换行 -->
                            <a-tag bordered>
                                <!-- 标签图标 -->
                                <template #icon><icon-align-left /></template>

                                {{ $t("label.wrap_breadcrumb") }}
                                <a-switch
                                    class="switch"
                                    v-model:model-value="config.render.breadcrumb.wrap"
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
                                    v-model:model-value="config.render.breadcrumb.item.wrap"
                                    size="small"
                                />
                            </a-tag>

                            <!-- 展开 -->
                            <a-button
                                class="button"
                                type="secondary"
                                size="mini"
                                @click="config.render.tree.fold === false ? tree.broadcast() : (config.render.tree.fold = false)"
                            >
                                <template #icon>
                                    <icon-expand />
                                </template>

                                {{ $t("label.unfold") }}
                            </a-button>

                            <!-- 折叠 -->
                            <a-button
                                class="button"
                                type="secondary"
                                size="mini"
                                @click="config.render.tree.fold === true ? tree.broadcast() : (config.render.tree.fold = true)"
                            >
                                <template #icon>
                                    <icon-shrink />
                                </template>

                                {{ $t("label.fold") }}
                            </a-button>
                        </a-space>
                    </template>
                </a-popover>

                <!-- REF [Arco Design Vue](https://arco.design/vue/component/popover) -->
                <!-- 鼠标悬浮气泡卡片 -->
                <a-popover position="bl">
                    <!-- REF [Arco Design Vue](https://arco.design/vue/component/badge) -->
                    <!-- 鼠标悬浮的元素 -->
                    <a-badge
                        class="title-label"
                        :status="status"
                        :text="$t('siyuan')"
                    />

                    <!-- 气泡卡片标题 -->
                    <template #title>
                        {{ $t("server_status") }}
                        <!-- REF [Arco Design Vue](https://arco.design/vue/component/tooltip) -->
                        <!-- 显示思源服务源的文字气泡 -->
                        <a-tooltip
                            :content="config.server.url"
                            position="bottom"
                            mini
                        >
                            <!-- REF [Arco Design Vue](https://arco.design/vue/component/tag) -->
                            <!-- 显示思源版本号的标签 -->
                            <a-tag>
                                <template #icon>
                                    <icon-info-circle v-show="status === Status.normal" />
                                    <icon-clock-circle v-show="status === Status.processing" />
                                    <icon-check-circle v-show="status === Status.success" />
                                    <icon-exclamation-circle v-show="status === Status.warning" />
                                    <icon-close-circle v-show="status === Status.danger" />
                                </template>
                                {{ version }}
                            </a-tag>
                        </a-tooltip>
                    </template>

                    <!-- 气泡卡片内容 -->
                    <template #content>
                        <!-- REF [Arco Design Vue](https://arco.design/vue/component/alert) -->
                        <!-- 显示上次状态提示信息 -->
                        <a-alert
                            :title="map(status).toUpperCase()"
                            :type="(map(status) as any)"
                        >
                            {{ message }}
                        </a-alert>
                    </template>
                </a-popover>

                <!-- REF [Arco Design Vue](https://arco.design/vue/component/input-tag) -->
                <!-- 搜索输入框 -->
                <a-input-tag
                    v-if="config.search.method === Method.keyword"
                    class="title-input-tag"
                    size="mini"
                    v-model:model-value="keywords"
                    :placeholder="$t('search')"
                    @change="search(true)"
                    allow-clear
                />
                <a-input
                    v-else
                    class="title-input"
                    size="mini"
                    v-model:model-value="query"
                    :placeholder="$t('search')"
                    @change="search(false)"
                    allow-clear
                />
            </div>
        </template>

        <!-- REF [Arco Design Vue](https://arco.design/vue/component/tabs) -->
        <a-tabs
            class="tabs"
            v-model:active-key="tab"
            :type="'card-gutter'"
            :size="'mini'"
            :justify="true"
            @change="tabsOnChange"
        >
            <tab-search-list />
            <tab-search-tree />
            <tab-settings />
        </a-tabs>
    </a-drawer>
</template>

<style lang="less">
.mark() {
    mark {
        background-color: transparent;
        color: inherit;
        margin: 0 0.25em;
        padding: 0 0.25em;
        outline: 1px solid;
    }
}

.tools {
    flex-wrap: wrap;

    .switch {
        margin-left: 0.5em;
    }
}

// 支持 .arco-* 选择器需要移除 scoped 标签
#siyuan-drawer {
    .arco-drawer-title {
        width: 100%;
    }

    .title {
        display: flex;
        align-items: center;

        .title-icon {
            width: 1em;
            height: 1em;
            flex: none;
        }

        .title-label {
            margin: 0 0.5em;
            font-size: inherit;
            flex: none;
        }

        .title-input,
        .title-input-tag {
            flex: auto;
        }
    }

    .icon {
        display: inline-block;
        width: 1em;
        height: 1em;

        &:not(:last-child) {
            margin-right: 0.5em;
        }

        &:is(img) {
            // REF: [vertical-align - CSS（层叠样式表） | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/vertical-align)
            vertical-align: middle;
        }
    }

    // 抽屉本体
    .arco-drawer {
        // 抽屉内容
        > .arco-drawer-body {
            padding: 0.5em;

            // 标签页
            .tabs {
                // 标签页内容
                > .arco-tabs-content {
                    padding: 0;
                }

                .mark();
            }
        }
    }
}

.descriptions {
    .mark();
}
</style>
