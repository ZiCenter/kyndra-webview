<script setup lang="ts">
import Phone from "@/components/atoms/icons/Phone.vue";
import {useDeviceOrientation} from '@vueuse/core'
import FloatingParticles from "@/components/atoms/FloatingParticles.vue";
import {computed, ref, watch} from "vue";
import deviceOrientationAudio from '@/assets/mp3/device-orientation.mp3'

const targetBeta = 90, targetGamma = 0

const {isSupported, beta, gamma} = useDeviceOrientation()

const completionTimer = ref<number>(-1)

const emit = defineEmits(['complete'])

const totalDeviation = computed(() => {
    console.log("values changed", beta.value, gamma.value)
    if (beta.value === null || gamma.value === null) return 90;
    console.log("recalculating")
    const betaDiff = Math.abs(beta.value - targetBeta)
    const gammaDiff = Math.abs(gamma.value - targetGamma)
    return Math.sqrt(betaDiff * betaDiff + gammaDiff * gammaDiff)
})

const status = computed(() => {
    const deviation = totalDeviation.value

    if (!isSupported)
        return {
            text: 'Not Supported',
            accuracy: 0
        }

    if (deviation < 5)
        return {
            text: '🎯 Perfect!',
            instructions: 'Great! Your phone is positioned vertically against the wall',
            accuracy: 100
        }
    if (deviation < 15)
        return {
            text: '🔄 Almost there',
            instructions: 'Small adjustments needed - keep it steady',
            accuracy: Math.round((1 - deviation / 30) * 100)
        }
    if (deviation < 30)
        return {
            text: '📱 Keep adjusting',
            instructions: 'Rotate your phone more towards vertical',
            accuracy: Math.round((1 - deviation / 50) * 100)
        }
    return {
        text: 'Initializing...',
        instructions: 'Move your phone to align it vertically against a wall',
        accuracy: Math.round(Math.max(0, (1 - deviation / 90) * 100))
    }

})

const showCheckmark = computed(() => status.value.accuracy === 100)

const tiltAngle = computed(() => Math.round(totalDeviation.value))

watch(status, () => {
    console.log(status.value.accuracy)
    if (status.value.accuracy !== 100) {
        clearTimeout(completionTimer.value)
        return;
    }

    completionTimer.value = window.setTimeout(() => emit("complete"), 1000)
    navigator.vibrate && navigator.vibrate(100)
})
</script>

<template>
    <v-container fluid class="app d-flex flex-column fill-height py-16">
        <FloatingParticles/>
        <audio :src="deviceOrientationAudio" v-show="false" autoplay />

        <div>
            <div class="d-flex justify-end">
                <v-btn variant="text" @click="$emit('complete')" >Skip</v-btn>
            </div>
            <h1 class="text-h3 mb-3">Position your phone</h1>
            <p class="text-subtitle-1">Stand your phone vertically against a wall</p>
        </div>

        <v-spacer/>

        <Phone :transform="`translate(-50%, -50%) rotateZ(${gamma || 0}deg) rotateX(${(beta || 0) - 90}deg)`"/>

        <v-spacer/>

        <div class="text-h6">
            {{ status.text }}
        </div>

        <div class="text-subtitle-2 text-center font-weight-light">
            {{ status.instructions }}
        </div>

        <Transition name="fade">
            <v-icon v-if="showCheckmark" size="42" color="primary">mdi-check-all</v-icon>
        </Transition>

        <div class="d-flex flex-row justify-center w-100 mt-6">
            <v-card max-width="120" variant="tonal" rounded="lg" class="pa-3 mx-2">
                <div class="text-overline">Tilt Angle</div>
                <div class="font-weight-bold">{{ tiltAngle }}°</div>
            </v-card>
            <v-card max-width="120" variant="tonal" rounded="lg" class="pa-3 mx-2">
                <div class="text-overline">Accuracy</div>
                <div class="font-weight-bold">{{ status.accuracy }} %</div>
            </v-card>
        </div>

    </v-container>
</template>

<style scoped>
.app {
    background: linear-gradient(135deg, #344357 0%, #000641 100%);
}
</style>
