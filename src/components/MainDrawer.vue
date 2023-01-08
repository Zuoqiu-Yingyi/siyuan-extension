<!-- REF [Arco Design Vue](https://arco.design/vue/component/drawer) -->
<script setup lang="ts">
import TabSearchVue from "./TabSearch.vue";
import TabSettingsVue from "./TabSettings.vue";

import { inject, Ref } from "vue";

const visible = inject("visible") as Ref; // 是否显示

function handleOk() {
    visible.value = false;
}
function handleCancel() {
    visible.value = false;
}
</script>

<template>
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
                <span class="title-label">
                    {{ $t("siyuan") }}
                </span>
                <a-input-tag
                    class="title-input"
                    size="mini"
                    :placeholder="$t('search')"
                    allow-clear
                />
            </div>
        </template>
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
        flex: none;
    }
    .title-input {
        flex: auto;
    }
}
</style>
