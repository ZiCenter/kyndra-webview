<script setup lang="ts">
import RestViewWithVideo from "@/components/molecules/RestViewWithVideo.vue";

defineProps<{
    duration: number,
    nextName?: string,
    nextVideoUrl?: string,
    reps?: number,
    accuracy?: number,
    calories?: number
}>()

const emit = defineEmits(['complete'])
</script>

<template>
    <RestViewWithVideo
        :duration="duration"
        :next-name="nextName"
        :next-video-url="nextVideoUrl"
        @complete="emit('complete')"
    />
</template>
