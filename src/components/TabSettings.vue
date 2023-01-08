<!-- REF [Arco Design Vue](https://arco.design/vue/component/tabs) -->
<script setup lang="ts">
import { inject, watch } from "vue";
import { VueI18nTranslation } from "vue-i18n";
import { Notification } from "@arco-design/web-vue";
import { IConfig } from "./../types/config";
import { SiyuanClient } from "../utils/siyuan";

const config = inject("config") as IConfig; // 是否显示
const client = inject("client") as InstanceType<typeof SiyuanClient>; // 思源客户端
/* 测试思源服务 */
async function testSiyuanServer($t: VueI18nTranslation): Promise<void> {
    // console.log(config.server.url);
    try {
        await client.lsNotebooks();
        Notification.success({
            title: $t("conect_siyuan_client"),
            content: $t("conect_success"),
            closable: true, // 是否显示关闭按钮
            duration: 3000, // 显示持续时间
        });
    } catch (e) {
        console.warn(e);
        Notification.error({
            title: $t("conect_siyuan_client"),
            content: String(e),
            closable: true,
            duration: 3000,
        });
    }
}

watch(
    () => config.server.protocol,
    (protocol: string) => {
        config.server.port = protocol === "https" ? 443 : 6806;
    },
);
</script>

<template>
    <a-tab-pane
        class="panel"
        key="2"
    >
        <template #title> <icon-settings /> {{ $t("settings") }} </template>
        <a-form
            class="form"
            size="small"
            :model="config"
            auto-label-width
        >
            <fieldset>
                <legend>{{ $t("conect_siyuan_client") }}</legend>
                <!-- 服务 -->
                <a-form-item :label="$t('siyuan_server')">
                    <template #help>
                        <div>{{ $t("help.server") }}</div>
                    </template>
                    <!-- 协议名 -->
                    <a-select
                        style="min-width: 6em; max-width: 6em"
                        v-model="config.server.protocol"
                    >
                        <a-option>http</a-option>
                        <a-option>https</a-option>
                    </a-select>
                    &thinsp;://&thinsp;
                    <!-- 主机名 -->
                    <a-input
                        style="flex: auto"
                        v-model="config.server.hostname"
                        :placeholder="$t('hostname')"
                    >
                        <!-- <template #prefix>://</template> -->
                    </a-input>
                    &thinsp;:&thinsp;
                    <!-- 端口号 -->
                    <a-input-number
                        style="min-width: 6em; max-width: 6em"
                        v-model="config.server.port"
                        :min="1"
                        :max="65535"
                    >
                        <!-- <template #prefix>:</template> -->
                    </a-input-number>
                </a-form-item>
                <!-- 令牌 -->
                <a-form-item :label="$t('token')">
                    <template #help>
                        <div>{{ $t("help.token") }}</div>
                    </template>
                    <a-input
                        v-model="config.server.token"
                        placeholder="0123456789abcdef"
                    />
                    <a-divider direction="vertical" />
                    <a-button
                        type="secondary"
                        status="normal"
                        @click="testSiyuanServer($t)"
                    >
                        <template #icon>
                            <icon-experiment />
                        </template>
                        {{ $t("test") }}
                    </a-button>
                </a-form-item>
            </fieldset>
        </a-form>
    </a-tab-pane>
</template>
<style scoped lang="less">
fieldset {
    margin: 0.5em;
    border: 1px solid var(--color-neutral-5);

    legend {
        padding: 0 0.5em;
    }
}
</style>
