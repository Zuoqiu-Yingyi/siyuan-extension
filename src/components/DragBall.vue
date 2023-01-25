<!-- REF [Vue3+TS封装一个可任意拖拽的悬浮球组件，可拓展_codnan的博客-CSDN博客_vue3悬浮球](https://blog.csdn.net/annans/article/details/127427847) -->
<script lang="ts" setup>
import { ref, unref, watchEffect } from "vue";
import { Storage } from "webextension-polyfill";

import { Position } from "./../utils/position";
import { browser } from "./../utils/browser";

/* 初始位置 */
const props = defineProps(["top", "bottom", "left", "right"]);

/* 当前位置 */
const top = ref<string | undefined>(props.top);
const bottom = ref<string | undefined>(props.bottom);
const left = ref<string | undefined>(props.left);
const right = ref<string | undefined>(props.right);

const position = new Position(); // 拖动前位置

/* 浏览器扩展环境 */
if (import.meta.env.PROD) {
    /* 从储存中读取悬浮球位置 */
    browser.storage.local
        .get({
            position: {
                top: unref(top),
                bottom: unref(bottom),
                left: unref(left),
                right: unref(right),
            },
        })
        .then(items => {
            if (top.value !== items.position.top) top.value = items.position.top;
            if (bottom.value !== items.position.bottom) bottom.value = items.position.bottom;
            if (left.value !== items.position.left) left.value = items.position.left;
            if (right.value !== items.position.right) right.value = items.position.right;
        });

    /* 监听悬浮球位置更改 */
    browser.storage.local.onChanged.addListener((changes: Storage.StorageAreaOnChangedChangesType) => {
        if (changes.position) {
            if (top.value !== changes.position.newValue.top) top.value = changes.position.newValue.top;
            if (bottom.value !== changes.position.newValue.bottom) bottom.value = changes.position.newValue.bottom;
            if (left.value !== changes.position.newValue.left) left.value = changes.position.newValue.left;
            if (right.value !== changes.position.newValue.right) right.value = changes.position.newValue.right;
        }
    });
}

// 拖拽开始事件
const dragstart = (e: DragEvent) => {
    // console.log(e);
    // 记录拖拽元素的原位置
    position.update(e);
};

// 拖拽完成事件
const dragend = (e: DragEvent) => {
    // console.log(e);

    const doc_width = document.documentElement.clientWidth; // 可视窗口的宽度
    const doc_height = document.documentElement.clientHeight; // 可视窗口的高度

    const x_delta = e.x - position.x; // 横坐标移动距离
    const y_delta = e.y - position.y; // 纵坐标移动距离

    const x_ratio = (e.x - position.offsetX + (e.target as HTMLElement).offsetWidth / 2) / doc_width; // 移动后元素中心相对于可视窗口的横坐标位置
    const y_ratio = (e.y - position.offsetY + (e.target as HTMLElement).offsetHeight / 2) / doc_height; // 移动后元素中心相对于可视窗口的纵坐标位置

    if (x_ratio < 0.5) {
        const ratio = (100 * (position.left + x_delta)) / doc_width;
        left.value = `${Math.max(ratio, 0)}vw`;
        right.value = undefined;
    } else {
        const ratio = (100 * (position.right - x_delta)) / doc_width;
        left.value = undefined;
        right.value = `${Math.max(ratio, 0)}vw`;
    }
    if (y_ratio < 0.5) {
        const ratio = (100 * (position.top + y_delta)) / doc_height;
        top.value = `${Math.max(ratio, 0)}vh`;
        bottom.value = undefined;
    } else {
        const ratio = (100 * (position.bottom - y_delta)) / doc_height;
        top.value = undefined;
        bottom.value = `${Math.max(ratio, 0)}vh`;
    }

    /* 浏览器扩展环境 */
    if (import.meta.env.PROD) {
        browser.storage.local.set({
            position: {
                top: unref(top),
                bottom: unref(bottom),
                left: unref(left),
                right: unref(right),
            },
        });
    }
};
</script>

<template>
    <div
        class="drag-ball"
        draggable="true"
        @dragstart="dragstart($event)"
        @dragend="dragend($event)"
        :style="{ top: top, bottom: bottom, left: left, right: right }"
    >
        <slot>DragBall</slot>
    </div>
</template>

<style scoped lang="less">
.drag-ball {
    cursor: pointer;
    position: fixed;

    // REF: [div中只有一张图片时，底部会有空白，需要加lineheight:0_扬州的你的博客-CSDN博客_div底部多出空白](https://blog.csdn.net/jtpython666/article/details/116278223)
    line-height: 0;

    > * {
        line-height: normal;
    }
}
</style>
