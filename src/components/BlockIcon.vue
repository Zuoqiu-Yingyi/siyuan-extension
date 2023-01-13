<script setup lang="ts">
import { BlockType, BlockSubType } from "../utils/siyuan";

const props = defineProps<{
    type: BlockType;
    subtype: BlockSubType;
}>();
</script>

<template>
    <span>
        <!-- 文档 -->
        <icon-file v-if="props.type === BlockType.NodeDocument" />

        <!-- 列表项 -->
        <icon-unordered-list v-else-if="props.type === BlockType.NodeListItem && props.subtype === BlockSubType.u" />
        <icon-ordered-list v-else-if="props.type === BlockType.NodeListItem && props.subtype === BlockSubType.o" />
        <icon-select-all v-else-if="props.type === BlockType.NodeListItem && props.subtype === BlockSubType.t" />

        <!-- 标题 -->
        <icon-h1 v-else-if="props.type === BlockType.NodeHeading && props.subtype === BlockSubType.h1" />
        <icon-h2 v-else-if="props.type === BlockType.NodeHeading && props.subtype === BlockSubType.h2" />
        <icon-h3 v-else-if="props.type === BlockType.NodeHeading && props.subtype === BlockSubType.h3" />
        <icon-h4 v-else-if="props.type === BlockType.NodeHeading && props.subtype === BlockSubType.h4" />
        <icon-h5 v-else-if="props.type === BlockType.NodeHeading && props.subtype === BlockSubType.h5" />
        <icon-h6 v-else-if="props.type === BlockType.NodeHeading && props.subtype === BlockSubType.h6" />

        <!-- 段落 -->
        <icon-language v-else-if="props.type === BlockType.NodeParagraph" />

        <!-- 数学公式 -->
        <icon-formula v-else-if="props.type === BlockType.NodeMathBlock" />

        <!-- 表格 -->
        <icon-nav v-else-if="props.type === BlockType.NodeTable" />

        <!-- 代码 -->
        <icon-code-block v-else-if="props.type === BlockType.NodeCodeBlock" />

        <!-- HTML -->
        <icon-code v-else-if="props.type === BlockType.NodeHTMLBlock" />

        <!-- 分割线 -->
        <icon-minus v-else-if="props.type === BlockType.NodeThematicBreak" />

        <!-- 音频 -->
        <icon-file-audio v-else-if="props.type === BlockType.NodeAudio" />

        <!-- 视频 -->
        <icon-file-video v-else-if="props.type === BlockType.NodeVideo" />

        <!-- IFrame -->
        <icon-cloud v-else-if="props.type === BlockType.NodeIFrame" />

        <!-- 挂件 -->
        <icon-apps v-else-if="props.type === BlockType.NodeWidget" />

        <!-- 查询 -->
        <icon-find-replace v-else-if="props.type === BlockType.NodeBlockQueryEmbed" />

        <!-- 其他 -->
        <icon-question-circle v-else />
    </span>
</template>

<style scoped lang="less"></style>
