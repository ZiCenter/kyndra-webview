<script setup lang="ts">

import {computed, onBeforeMount, ref} from "vue";
import {EXTERNAL_URLS} from "@/utils/constants";

const props = defineProps<{
    duration: number,
    nextName?: string,
    nextVideoUrl?: string,
}>()
const elapsed = ref(0)

const emit = defineEmits(['complete'])

onBeforeMount(() => {
    if (props.duration === 0) {
        emit('complete')
    }
})

const timer = setInterval(() => {
    if (elapsed.value >= props.duration) {
        clearInterval(timer)
        emit('complete')
        return;
    }
    elapsed.value++
}, 1000)

const progress = computed(() => elapsed.value / props.duration * 100)
</script>

<template>
    <div class="rest-view-container">
        <video
            v-if="nextVideoUrl"
            :src="nextVideoUrl"
            class="background-video"
            autoplay
            muted
            loop
        />
        <v-container fluid class="fill-height d-flex flex-column justify-space-between align-start px-3 pt-16 content-overlay">
            <audio :src="EXTERNAL_URLS.REST_BACKGROUND_AUDIO" autoplay v-show="false"/>
            <v-spacer/>
            <v-list width="100%" bg-color="surface-light" class="position-relative py-0">
                <v-sheet class="position-absolute" height="100%" :width="`${progress}%`" color="primary"></v-sheet>
                <v-list-item v-if="nextName" append-icon="mdi-arrow-right-bold-circle-outline">
                    <template #title>
                        <div class="text-overline font-weight-light text-medium-emphasis">Next Exercise</div>
                    </template>
                    <template #subtitle>
                        <div class="text-h6 font-weight-bold text-high-emphasis">{{ nextName }}</div>
                    </template>
                </v-list-item>
            </v-list>
        </v-container>
    </div>
</template>

<style scoped>
.rest-view-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.content-overlay {
  position: relative;
  z-index: 2;
  background: rgba(0, 0, 0, 0.3);
}
</style>
