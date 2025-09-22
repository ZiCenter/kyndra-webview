<script setup lang="ts">
defineSlots()
</script>

<template>
    <v-card
        width="100vw"
        min-width="100vw"
        max-width="100vw"
        height="100vh"
        min-height="100vh"
        max-height="100vh"
        class="overlay-container"
        :rounded="0"
        color="transparent"
    >
        <slot></slot>
    </v-card>
</template>

<style scoped>
.overlay-container {
    position: absolute;
    display: flex;
    overflow: hidden;
    top: 0;
    left: 0;
}
</style>
