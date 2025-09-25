<script setup lang="ts">
import BubbleProgress from "@/components/atoms/BubbleProgress.vue";
import type {TimedScoreCard} from "@/components/overlays.types.ts";
import {useQueryConfig} from "@/composables/useQueryConfig";
import {computed, onMounted, onUnmounted, ref, watch} from "vue";

const timerAudio = ref<HTMLAudioElement>()
const chimeAudio = ref<HTMLAudioElement>()

const count = ref(0)

const props = defineProps<TimedScoreCard.Props>()
const emit = defineEmits<TimedScoreCard.Events>()
const timer = ref<number>(-1)

const config = useQueryConfig()

const startTimer = () => {
    if (timer.value !== -1) return;
    timer.value = setInterval(() => {
        if (count.value < props.duration) {
            count.value++
            return;
        }
        clearInterval(timer.value)
        timer.value = -1
        timerAudio.value?.pause()
        emit('complete')
        return;
    }, 1000)

    timerAudio.value?.play()
}

const pauseTimer = () => {
    if (timer.value === -1) return;
    clearInterval(timer.value)
    timer.value = -1
    timerAudio.value?.pause()
}

onMounted(() => {
    if (!props.isPaused) startTimer()
})

onUnmounted(() => pauseTimer())

watch(() => props.isPaused, (isPaused) => {
    if (isPaused) pauseTimer() else startTimer()
})

const onTimerAudioEnded = () => {
    setTimeout(() => timerAudio.value?.play(), 250)
}

watch(() => props.value, (newValue, oldValue) => {
    if (newValue <= oldValue) {
        return;
    }
    const audio = chimeAudio.value!
    audio.pause()
    audio.currentTime = 0
    audio.play()
})

</script>

<template>
    <v-container fluid class="app d-flex flex-column fill-height">
        <audio ref="timerAudio" src="/sounds/tick-tock.mp3" volume="0.4" @ended="onTimerAudioEnded"/>
        <audio ref="chimeAudio" src="/sounds/success-chime.mp3" volume="1"/>
        <v-card
            v-if="config.ui"
            height="50vw"
            flat
            class="container d-flex position-absolute border"
        >
            <v-sheet height="50vw" width="50vw" rounded="circle" color="transparent"
                     class="border-e-sm pa-4" :elevation="1">
                <BubbleProgress :value="count" :total="duration" label="Secs"/>
            </v-sheet>
            <v-sheet height="50vw" width="50vw" color="transparent"
                     rounded="circle"
                     class="d-flex flex-column justify-center align-center">
                <div class="text-start">
                    <span class="text-h1 font-weight-bold mr-2">{{ value }}</span>
                    <span class="text-subtitle-1 font-weight-light text-uppercase">Reps</span>
                </div>
            </v-sheet>
        </v-card>
    </v-container>
</template>

<style scoped>
.app {
    background: #2A7B9B;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(2, 86, 131, 0) 70%, rgba(0, 52, 103, 0.56) 100%);
}

.container {
    left: 3px;
    right: 3px;
    bottom: 3px;
    border-radius: 25px;
    padding: 1px;
    background-color: rgba(255, 255, 255, 0.19);
}
</style>
