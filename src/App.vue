<script setup lang="ts">
import DragBall from "./components/DragBall.vue";
import MainDrawer from "./components/MainDrawer.vue";

import { ref, provide, reactive, inject, watch, shallowReactive, computed } from "vue";
import { I18n } from "vue-i18n";

import { IConfig } from "./types/config";
import { IPreview } from "./types/preview";
import { Data_fullTextSearchBlock, INotebooks } from "./types/siyuan";

import { GroupBy, Method, OrderBy, SiyuanClient } from "./utils/siyuan";
import { Status } from "./utils/status";
import { mapLabel } from "./utils/language";
import { Theme } from "./utils/theme";
import { Icon } from "./utils/icon";
import { Tree } from "./utils/tree";

const i18n = inject("i18n") as I18n; // 国际化引擎

/* 笔记本列表 */
const notebooks = shallowReactive<INotebooks>({
    list: [],
    map: new Map(),
});

/* 监听 list 更改时更新 map */
watch(
    () => notebooks.list,
    list => {
        /* 重建映射 */
        notebooks.map.clear();
        list.forEach(notebook => {
            notebook.icon = Icon.icon2emojis(notebook.icon, client.url);
            notebooks.map.set(notebook.id, notebook);
        });
    },
);
provide("notebooks", notebooks);

/* 用户配置 */
const config: IConfig = reactive({
    server: {
        protocol: "http",
        hostname: "localhost",
        port: 6806,
        token: "",
        url: new URL("http://localhost:6806"),
    },
    search: {
        groupBy: GroupBy.group,
        method: Method.keyword,
        orderBy: OrderBy.sortByRankDesc,
        paths: [],
        types: {
            heading: true,
            paragraph: true,
            mathBlock: true,
            table: true,
            codeBlock: true,
            htmlBlock: true,
            embedBlock: true,

            document: true,
            superBlock: false,
            blockquote: false,
            list: false,
            listItem: true,
        },
    },
    render: {
        breadcrumb: {
            wrap: true,
            item: {
                wrap: true,
            },
        },
        tree: {
            fold: false,
        },
    },
    other: {
        language: {
            tag: i18n.global.locale,
            label: "",
        },
        languages: [
            {
                tag: "en",
                label: "English",
            },
            {
                tag: "zh-Hans",
                label: "简体中文",
            },
            {
                tag: "zh-Hant",
                label: "繁体中文",
            },
        ],
    },
});

const status = ref(Status.normal); // 连接状态
const message = ref(""); // 连接状态消息
const version = ref(""); // 内核版本

const client = new SiyuanClient(config.server.url, config.server.token, status, message);

watch(
    [() => config.server.protocol, () => config.server.hostname, () => config.server.port],
    ([protocol, hostname, port]) => {
        config.server.url.protocol = protocol;
        config.server.url.hostname = hostname;
        config.server.url.port = String(port);

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
    },
);

watch(
    () => config.other.language.tag,
    tag => {
        config.other.language.label = mapLabel(tag);
        // @ts-ignore
        i18n.global.locale = tag in i18n.global.messages ? tag : i18n.global.fallbackLocale;
    },
    {
        immediate: true, // 立即执行一次
    },
);

// REF: [依赖注入 | Vue.js](https://cn.vuejs.org/guide/components/provide-inject.html#provide)
provide("config", config);
provide("client", client);
provide("status", status);
provide("message", message);
provide("version", version);

/* 👇 主题状态 👇 */
const theme = reactive(new Theme());
provide("theme", theme);
/* 👆 主题状态 👆 */

/* 👇 抽屉状态 👇 */
const visible = ref(false); // 抽屉是否可见
const size = ref(0.5); // 抽屉宽度占比
provide("visible", visible);
/* 👆 抽屉状态 👆 */

/* 👇 查询结果 👇 */
const results = shallowReactive<Data_fullTextSearchBlock>({
    blocks: [],
    matchedBlockCount: 0,
    matchedRootCount: 0,
}); // 查询结果
const grouped = computed(() => results.blocks?.[0].children?.length > 0 ?? false); // 是否分组
const tree = new Tree(results, notebooks); // 节点树

provide("results", results);
provide("grouped", grouped);
provide("tree", tree);
/* 👆 查询结果 👆 */

/* 👇 预览 👇 */
const preview = shallowReactive<IPreview>({
    display: false,
    id: "",
    focus: true,
}); // 是否开启预览

const preview_url = new URL(config.server.url);
preview_url.pathname = "/stage/build/mobile/";

/* 跟踪思源服务源设置 */
watch(
    [() => config.server.protocol, () => config.server.hostname, () => config.server.port],
    ([protocol, hostname, port]) => {
        preview_url.protocol = protocol;
        preview_url.hostname = hostname;
        preview_url.port = String(port);
    },
    { immediate: true },
);

/* 搜索结果更改时隐藏预览界面 */
watch(
    () => results.blocks,
    () => {
        preview.display = false;
    },
);

const preview_src = computed(() => {
    preview_url.searchParams.set("r", Date.now().toString());
    preview_url.searchParams.set("id", preview.id);
    if (preview.focus) {
        preview_url.searchParams.set("focus", "1");
    } else {
        preview_url.searchParams.delete("focus");
    }
    return preview_url.href;
});
provide("preview", preview);
/* 👆 预览 👆 */

/* 👇 伸缩面板 👇 */
function onmoveStart() {
    Array.prototype.forEach.call(document.getElementsByTagName("iframe"), iframe => (iframe.style.pointerEvents = "none"));
}

function onmoveEnd() {
    Array.prototype.forEach.call(document.getElementsByTagName("iframe"), iframe => (iframe.style.pointerEvents = "unset"));
}
/* 👆 伸缩面板 👆 */
</script>

<template>
    <!-- <hello-world msg="Vite + Vue" /> -->
    <Teleport to="body">
        <!-- 打开抽屉的悬浮球 -->
        <drag-ball
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
        </drag-ball>

        <!--
            REF [Arco Design Vue](https://arco.design/vue/component/split)
            分割面板, 用于调整抽屉的宽度
        -->
        <a-split
            class="split-container"
            v-model:size="size"
            v-show="visible"
            @moveStart="onmoveStart"
            @moveEnd="onmoveEnd"
        >
            <template #first>
                <!-- 模仿抽屉的遮罩 -->
                <a-layout
                    class="split-panel"
                    style="background-color: var(--color-mask-bg)"
                    @click.self="visible = !visible"
                >
                    <a-layout-content v-if="preview.display">
                        <iframe
                            id="preview"
                            :src="preview_src"
                            frameborder="0"
                        ></iframe>
                    </a-layout-content>
                </a-layout>
            </template>

            <template #second>
                <!-- 抽屉容器 -->
                <a-layout
                    id="drawerContainer"
                    class="split-panel"
                >
                    <!-- 抽屉内容 -->
                    <main-drawer
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

        #preview {
            position: relative;
            width: 100%;
            height: 100%;
        }
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
