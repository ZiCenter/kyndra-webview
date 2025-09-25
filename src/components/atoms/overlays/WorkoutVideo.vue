<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref} from "vue";

const videoElement = ref<HTMLVideoElement>();
const countdownValue = ref(0);
let countdownInterval: number | undefined;

const props = defineProps<{
    url: string;
    name: string;
    countdown?: number;
}>()

const emit = defineEmits<{ complete: []; }>()

const previewDone = computed(() => countdownValue.value <= 0)

// Countdown functionality
const startCountdown = () => {
    if (!props.countdown) return;

    countdownValue.value = props.countdown;
    countdownInterval = window.setInterval(() => {
        if (previewDone.value) {
            window.clearInterval(countdownInterval);
            emit('complete');
            return;
        }
        countdownValue.value--;
    }, 1000);
}

onMounted(() => {
    startCountdown();
})

onUnmounted(() => {
    if (countdownInterval) {
        window.clearInterval(countdownInterval);
    }
})
</script>

<template>
    <div class="fill-height w-100">
        <video
            id="video"
            ref="videoElement"
            :src="url"
            autoplay
            playsinline
            loop
            :class="{thumbnail: previewDone, preview: !previewDone}"
        />

        <div v-if="!previewDone" class="position-absolute top-0 py-10 px-10 mr-6">
            <div class="text-h4 font-weight-bold mb-6">{{ name }}</div>
        </div>

        <!-- Countdown overlay -->
        <div v-if="!previewDone" class="countdown-overlay">
            <div class="countdown-circle">
                <div class="countdown-number">{{ countdownValue }}</div>
            </div>
            <div class="countdown-text">Get Ready!</div>
        </div>
    </div>
</template>

<style scoped>
#video {
    top: 0;
    right: 0;
    object-fit: cover;
    transition: all 0.5s;
    position: absolute;
}

#video.thumbnail {
    width: auto;
    height: 250px;
    margin: 40px 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

#video.preview {
    width: 100% !important;
    height: 100% !important;
}

.countdown-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
}

.countdown-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    border: 4px solid #fff;
}

.countdown-number {
    color: white;
    font-size: 48px;
    font-weight: bold;
}

.countdown-text {
    color: white;
    font-size: 24px;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}
</style>
