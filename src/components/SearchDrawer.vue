<!-- REF [Arco Design Vue](https://arco.design/vue/component/drawer) -->
<script setup lang="ts">
import { inject, Ref } from 'vue'

const visible = inject('visible') as Ref;

function handleOk() {
    visible.value = false;
}
function handleCancel() {
    visible.value = false;
}
</script>

<template>
    <a-drawer
        :width="340"
        :visible="visible"
        @ok="handleOk"
        @cancel="handleCancel"
        unmountOnClose
    >
        <template #title> Title </template>
        <div>You can customize modal body text by the current situation. This modal will be closed immediately once you press the OK button.</div>
    </a-drawer>
</template>
