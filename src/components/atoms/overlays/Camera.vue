<script setup lang="ts">
import {dispose, initCamera} from "@/utils/camera.utils.ts";
import {onMounted, onUnmounted, ref} from "vue";

const videoElement = ref<HTMLVideoElement>();

const emit = defineEmits(['ready'])

onMounted(() => {
    initCamera(videoElement.value!)
    videoElement.value?.addEventListener('loadedmetadata', () => emit('ready'))
});

onUnmounted(dispose)

defineExpose({el: videoElement})

</script>

<template>
  <video id="video" ref="videoElement" autoplay playsinline></video>
</template>

<style scoped>
#video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
}
</style>
