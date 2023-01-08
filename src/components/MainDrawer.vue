<script setup lang="ts">
import TabSearchVue from "./TabSearch.vue";
import TabSettingsVue from "./TabSettings.vue";

import { inject, Ref } from "vue";
import { Status, map } from "./../utils/status";

const visible = inject("visible") as Ref<boolean>; // 是否显示
const status = inject("status") as Ref<Status>; // 连接状态
const message = inject("message") as Ref<string>; // 连接状态消息
const version = inject("version") as Ref<string>; // 内核版本

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
        :visible="visible"
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
                <a-popover position="br">
                    <!-- REF [Arco Design Vue](https://arco.design/vue/component/badge) -->
                    <a-badge
                        class="title-label"
                        :status="status"
                        :text="$t('siyuan')"
                    />
                    <template #title>
                        {{ $t("status_server") }}
                        <!-- REF [Arco Design Vue](https://arco.design/vue/component/tag) -->
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
                    </template>
                    <template #content>
                        <!-- REF [Arco Design Vue](https://arco.design/vue/component/alert) -->
                        <a-alert
                            :title="map(status).toUpperCase()"
                            :type="(map(status) as any)"
                        >
                            {{ message }}
                        </a-alert>
                    </template>
                </a-popover>
                <!-- REF [Arco Design Vue](https://arco.design/vue/component/input-tag) -->
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
            :type="'card-gutter'"
            :size="'mini'"
            :justify="true"
        >
            <TabSearchVue />
            <TabSettingsVue />
        </a-tabs>
    </a-drawer>
</template>

<style scoped lang="less">
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
</style>
