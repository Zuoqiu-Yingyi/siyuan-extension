<script setup lang="ts">
import TabSearchVue from "./TabSearch.vue";
import TabSettingsVue from "./TabSettings.vue";

import { inject, Ref } from "vue";
import { IConfig } from "./../types/config";
import { Status, map } from "../utils/status";

const visible = inject("visible") as Ref<boolean>; // 是否显示
const status = inject("status") as Ref<Status>; // 连接状态
const message = inject("message") as Ref<string>; // 连接状态消息
const version = inject("version") as Ref<string>; // 内核版本

const config = inject("config") as IConfig; // 用户配置

function handleOk() {
    visible.value = false;
}
function handleCancel() {
    visible.value = false;
}
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
                    class="title-input"
                    size="mini"
                    :placeholder="$t('search')"
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
            <TabSearchVue />
            <TabSettingsVue />
        </a-tabs>
    </a-drawer>
</template>

<style lang="less">
// 支持 .arco-* 选择器需要移除 scoped 标签
#siyuan-drawer {
    .title {
        display: flex;
        align-items: center;

        .title-icon {
            width: 1em;
            height: 1em;
            line-height: inherit;
            flex: none;
        }

        .title-label {
            margin: 0 0.5em;
            font-size: inherit;
            flex: none;
        }
        .title-input {
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
