<script setup lang="ts">
import {CanvasRenderer} from "@/services/canvas.renderer.ts";
import {setCanvas} from "@zicenter/kyndra";
import {onUnmounted, ref, watch} from "vue";

const canvasElement = ref<HTMLCanvasElement>();

const props = defineProps<{ videoWidth: number, videoHeight: number }>()

watch([canvasElement], () => {
    setCanvas(!canvasElement.value ? null : new CanvasRenderer(canvasElement.value!, props.videoWidth, props.videoHeight))
})

onUnmounted(() => setCanvas(null))
</script>

<template>
    <canvas class="canvas" ref="canvasElement"></canvas>
</template>

<style scoped>
.canvas {
    width: 100%;
    height: 100%;
    transform: scaleX(-1);
}
</style>
