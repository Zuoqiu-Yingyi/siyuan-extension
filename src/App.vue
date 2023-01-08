<script setup lang="ts">
import HelloWorldVue from "./components/HelloWorld.vue";
import DragBallVue from "./components/DragBall.vue";
import MainDrawerVue from "./components/MainDrawer.vue";

import { ref, provide, reactive, watch } from "vue";
import { IConfig } from "./types/config";
import { SiyuanClient } from "./utils/siyuan";
import { Status } from "./utils/status";

const visible = ref(false); // 抽屉是否可见
const size = ref(0.5); // 抽屉宽度占比
const status = ref(Status.normal); // 连接状态
const message = ref(""); // 连接状态消息
const version = ref(""); // 内核版本

const config: IConfig = reactive({
    server: {
        protocol: "http",
        hostname: "localhost",
        port: 6806,
        token: "",
        url: new URL("http://localhost:6806"),
    },
});
const client = new SiyuanClient(config.server.url, config.server.token, status, message);

watch(
    () => config.server,
    newVal => {
        config.server.url.protocol = newVal.protocol;
        config.server.url.hostname = newVal.hostname;
        config.server.url.port = String(newVal.port);

        client.update(config.server.url, config.server.token);
        setTimeout(async () => {
            try {
                const r = await client.version();
                version.value = `v${r.data}`;
                status.value = Status.normal;
            } catch (error) {
                version.value = "";
                status.value = Status.danger;
            }
        }, 0);
    },
    {
        immediate: true, // 立即执行一次
        deep: true, // 深层跟踪
    },
);

// REF: [依赖注入 | Vue.js](https://cn.vuejs.org/guide/components/provide-inject.html#provide)
provide("visible", visible);
provide("config", config);
provide("client", client);
provide("status", status);
provide("message", message);
provide("version", version);
</script>

<template>
    <HelloWorldVue msg="Vite + Vue" />
    <Teleport to="body">
        <!-- 打开抽屉的悬浮球 -->
        <DragBallVue
            style="z-index: 1"
            :top="'2em'"
            :right="'2em'"
        >
            <a-button
                type="outline"
                shape="circle"
                @click="visible = !visible"
            >
                <img
                    style="width: 75%; height: 75%"
                    src="./assets/siyuan-32.png"
                    alt="siyuan logo"
                />
            </a-button>
        </DragBallVue>
        <!--
            REF [Arco Design Vue](https://arco.design/vue/component/split)
            分割面板, 用于调整抽屉的宽度
        -->
        <a-split
            class="split-container"
            v-model:size="size"
            v-show="visible"
        >
            <template #first>
                <!-- 模仿抽屉的遮罩 -->
                <a-layout
                    class="split-panel"
                    style="background-color: var(--color-mask-bg)"
                    @click="visible = !visible"
                >
                </a-layout>
            </template>
            <template #second>
                <!-- 抽屉容器 -->
                <a-layout
                    id="drawerContainer"
                    class="split-panel"
                >
                    <!-- 抽屉内容 -->
                    <MainDrawerVue
                        style="z-index: unset; position: unset"
                        :width="'100%'"
                        :footer="false"
                        popupContainer="#drawerContainer"
                    />
                </a-layout>
            </template>
        </a-split>
    </Teleport>
</template>

<style scoped lang="less">
.split-container {
    z-index: 1000;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .split-panel {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
}

.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
}

.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
