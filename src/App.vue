<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
import DragBall from "./components/DragBall.vue";
</script>

<template>
    <HelloWorld msg="Vite + Vue" />
    <DragBall
        style="z-index: 1"
        :top="'2em'"
        :right="'2em'"
    >
        <img
            src="./assets/siyuan-32.png"
            alt="siyuan logo"
        />
    </DragBall>
</template>

<style scoped>
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
