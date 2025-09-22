<script setup lang="ts">
import DeviceOrientation from "@/components/steppers/DeviceOrientation.vue";
import Initializing from "@/components/steppers/Initializing.vue";
import SoundCheck from "@/components/steppers/SoundCheck.vue";
import {computed, ref} from "vue";

const components = {
    Initializing,
    SoundCheck,
    DeviceOrientation,
}

// @ts-ignore
const steps: Array<keyof typeof components> = Object.keys(components)
const currentStep = ref(0)
const currentComponent = computed(() => components[steps[currentStep.value]])

const emit = defineEmits(['complete'])

const onComplete = () => {
    if (currentStep.value < steps.length - 1) {
        currentStep.value++
    } else {
        emit('complete')
    }
}

</script>

<template>
    <component :is="currentComponent" @complete="onComplete"/>
</template>

<style scoped>

</style>
