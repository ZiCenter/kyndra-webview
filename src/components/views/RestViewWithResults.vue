<script setup lang="ts">

import BubbleProgress from "@/components/atoms/BubbleProgress.vue";
import {onBeforeMount, ref} from "vue";

const props = defineProps<{
    duration: number,
    nextName?: string,
    accuracy: number,
    reps: number,
    calories: number
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
</script>

<template>
    <v-container fluid class="fill-height d-flex flex-column justify-space-between align-start px-3 pt-16">
        <audio src="/sounds/rest.mp3" autoplay v-show="false"/>
        <v-spacer/>
        <div class="text-h2 font-weight-light mb-6 text-high-emphasis">Take a Rest</div>
        <div>
            <div class="mb-2">
                <div class="text-body-1 font-weight-light text-uppercase text-medium-emphasis">Accuracy</div>
                <div class="text-h1 font-weight-light text-high-emphasis">{{ (accuracy * 100).toFixed(1) }}<span class="text-h4">%</span></div>
            </div>
            <v-list bg-color="transparent">
                <v-list-item lines="two" :title="calories" subtitle="Calories Burnt" prepend-icon="mdi-gas-burner"/>
                <v-list-item lines="two" :title="reps" subtitle="Sets" prepend-icon="mdi-weight-lifter"/>
                <v-list-item lines="two" title="30" subtitle="Seconds" prepend-icon="mdi-timer-check-outline"/>
            </v-list>
        </div>
        <v-sheet width="250" height="250" color="transparent" class="mx-auto">
            <BubbleProgress :value="elapsed" :total="props.duration" label="Secs"/>
        </v-sheet>
        <v-spacer/>
        <v-list width="100%" bg-color="surface-light">
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
</template>

<style scoped>

</style>
