<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
import DragBall from "./components/DragBall.vue";
import SearchDrawer from "./components/SearchDrawer.vue";

import { ref, provide } from "vue";

const visible = ref(false); // 抽屉是否可见
// REF: [依赖注入 | Vue.js](https://cn.vuejs.org/guide/components/provide-inject.html#provide)
provide("visible", visible);
</script>

<template>
    <HelloWorld msg="Vite + Vue" />
    <!-- 打开抽屉的悬浮球 -->
    <DragBall
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
    </DragBall>
    <!-- 抽屉 -->
    <Teleport to="body">
        <!--
            REF [Arco Design Vue](https://arco.design/vue/component/split)
            分割面板, 用于调整抽屉的宽度
         -->
        <a-split
            class="split-container"
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
                    <SearchDrawer
                        :width="'100%'"
                        style="z-index: unset; position: unset"
                        popupContainer="#drawerContainer"
                    />
                </a-layout>
            </template>
        </a-split>
    </Teleport>
</template>

<style scoped lang="less">
.split-container {
    z-index: 2147483647;
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
