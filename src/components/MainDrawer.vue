<script setup lang="ts">
import TabSearch from "./TabSearch.vue";
import TabSettings from "./TabSettings.vue";

import { ref, shallowReactive, toRaw, inject, provide, watch, Ref, ShallowReactive } from "vue";
import { VueI18nTranslation } from "vue-i18n";
import { Notification } from "@arco-design/web-vue";

import { IConfig } from "./../types/config";
import { INotebooks, Data_fullTextSearchBlock } from "./../types/siyuan";
import { Status, map } from "./../utils/status";
import { Method, SiyuanClient } from "./../utils/siyuan";

const status = inject("status") as Ref<Status>; // 连接状态
const message = inject("message") as Ref<string>; // 连接状态消息
const version = inject("version") as Ref<string>; // 内核版本

const visible = inject("visible") as Ref<boolean>; // 是否显示

const config = inject("config") as IConfig; // 用户配置

function handleOk() {
    visible.value = false;
}
function handleCancel() {
    visible.value = false;
}

/* 👇 查询内容 👇 */
const query = ref(""); // 查询语句
const keywords = ref<string[]>([]); // 查询关键词
const results = shallowReactive<Data_fullTextSearchBlock>({
    blocks: [],
    matchedBlockCount: 0,
    matchedRootCount: 0,
}); // 查询结果

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
async function search($t: VueI18nTranslation, keyword: boolean) {
    try {
        const q = keyword ? keywords2query(keywords.value) : query.value;
        if (q.length === 0) {
            results.blocks = [];
            results.matchedBlockCount = 0;
            results.matchedRootCount = 0;
            return;
        }

        if (notebooks.list.length === 0) {
            const response = await client.lsNotebooks();
            notebooks.list = response.data.notebooks;
        }

        // REF [响应式 API：进阶 toRay() | Vue.js](https://cn.vuejs.org/api/reactivity-advanced.html#toraw)
        // REF [响应式 API：工具函数 unref() | Vue.js](https://cn.vuejs.org/api/reactivity-utilities.html#unref)
        const payload = Object.assign({}, toRaw(config.search), {
            query: q,
        });

        const response = await client.fullTextSearchBlock(payload);

        results.blocks = response.data.blocks;
        results.matchedRootCount = response.data.matchedRootCount;
        results.matchedBlockCount = response.data.matchedBlockCount;
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

provide("results", results);
/* 👆 查询内容 👆 */
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
                <img
                    class="title-icon"
                    src="./../assets/siyuan-32.png"
                />

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
                            :content="config.server.url.origin"
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
                    @change="search($t, true)"
                    allow-clear
                />
                <a-input
                    v-else
                    class="title-input"
                    size="mini"
                    v-model="query"
                    :placeholder="$t('search')"
                    @change="search($t, false)"
                    allow-clear
                />
            </div>
        </template>

        <!-- REF [Arco Design Vue](https://arco.design/vue/component/tabs) -->
        <a-tabs
            class="tabs"
            :type="'card-gutter'"
            :size="'mini'"
            :justify="true"
        >
            <tab-search />
            <tab-settings />
        </a-tabs>
    </a-drawer>
</template>

<style lang="less">
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
            }
        }
    }
}
</style>
