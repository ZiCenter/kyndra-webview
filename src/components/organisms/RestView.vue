<script setup lang="ts">
import RestViewWithResults from "@/components/molecules/RestViewWithResults.vue";
import RestViewWithVideo from "@/components/molecules/RestViewWithVideo.vue";
import {useQueryConfig} from "@/composables/useQueryConfig";

defineProps<{
    duration: number,
    nextName?: string,
    nextVideoUrl?: string,
    reps?: number,
    accuracy?: number,
    calories?: number
}>()

const emit = defineEmits(['complete'])

const config = useQueryConfig()
</script>

<template>
    <RestViewWithResults
        v-if="config.showResultsInRest"
        :duration="duration"
        :next-name="nextName"
        :reps="reps || 0"
        :accuracy="accuracy || 0"
        :calories="calories || 0"
        @complete="emit('complete')"
    />
    <RestViewWithVideo
        v-else
        :duration="duration"
        :next-name="nextName"
        :next-video-url="nextVideoUrl"
        @complete="emit('complete')"
    />
</template>
