<script setup lang="ts">
import {computed} from "vue";

const props = defineProps<{ mask: string }>()
defineEmits(['complete'])

const mask = computed(() => ({
    'mask-image': `url(${props.mask})`,
    '-webkit-mask-image': `url(${props.mask})`,
}))
</script>

<template>
    <audio :src="`/sounds/pose-silhouette.mp3`" autoplay v-show="false" @ended="$emit('complete')"></audio>
    <v-card id="mask-overlay" height="100%" width="100%" />
    <v-card id="mask-container" variant="plain" rounded="0" height="100%" width="100%">
        <v-sheet id="mask" :style="{...mask}"></v-sheet>
    </v-card>
</template>

<style scoped>
#mask-overlay {
    position: absolute;
    clip-path: url(#mask);
    background-color: rgba(14, 14, 14, 0.2);
}

#mask-container {
    position: absolute;
    bottom: 0;
    background-color: #262626;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
}

#mask {
    width: 100%;
    min-height: 100%;
    background-color: rgba(255, 255, 255, 0.33);
    mask-origin: content-box;
    mask-size: 100%;
    mask-position: center;
    mask-repeat: no-repeat;
    mask-mode: luminance;
}
</style>
