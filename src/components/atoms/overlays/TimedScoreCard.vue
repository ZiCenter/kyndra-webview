<script setup lang="ts">
import type {TimedScoreCard} from "@/components/atoms/overlays/overlays.types.ts";
import {useQueryConfig} from "@/composables/useQueryConfig.ts";
import {useTimerAudio, useChimeAudio} from "@/composables/useAudio.ts";
import {computed, onMounted, onUnmounted, ref, watch} from "vue";

const timerAudio = useTimerAudio()
const chimeAudio = useChimeAudio()

const count = ref(0)

const props = defineProps<TimedScoreCard.Props>()
const emit = defineEmits<TimedScoreCard.Events>()
const timer = ref<number>(-1)

const config = useQueryConfig()

const timePercentage = computed(() => count.value / props.duration * 100)

const startTimer = () => {
    if (timer.value !== -1) return;
    timer.value = setInterval(() => {
        if (count.value < props.duration) {
            count.value++
            return;
        }
        clearInterval(timer.value)
        timer.value = -1
        timerAudio.pause()
        emit('complete')
        return;
    }, 1000)

    timerAudio.play()
}

const pauseTimer = () => {
    if (timer.value === -1) return;
    clearInterval(timer.value)
    timer.value = -1
    timerAudio.pause()
}

onMounted(() => {
    if (!props.isPaused) startTimer()
})

onUnmounted(() => pauseTimer())

watch(() => props.isPaused, (isPaused) => {
    if (isPaused) pauseTimer()
    else startTimer()
})


watch(() => props.value, (newValue, oldValue) => {
    if (newValue <= oldValue) {
        return;
    }
    chimeAudio.play()
})

</script>

<template>
    <v-container fluid class="app d-flex flex-column fill-height">
        <v-card v-if="config.ui" color="transparent" flat width="100%" class="position-absolute bottom-0 px-6 mb-6">
            <v-sheet height="85px" width="65px" color="white"
                     class="float-end rounded-lg d-flex justify-center align-center mb-8">
                <span class="text-h2 font-weight-bold text-high-emphasis">{{ value }}</span>
            </v-sheet>

            <v-progress-linear :model-value="timePercentage" color="blue" class="bg-white rounded-pill" height="60px">
                <div class="text-center">
                    <span class="text-h4 font-weight-bold mr-2 text-high-emphasis">00:{{ count }}</span>
                </div>
            </v-progress-linear>
        </v-card>
    </v-container>
</template>

<style scoped>
.app {
    background: #2A7B9B;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(2, 86, 131, 0) 70%, rgba(0, 52, 103, 0.56) 100%);
}

</style>
