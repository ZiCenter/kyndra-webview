<script setup lang="ts">
import type {Countdown} from "@/components/atoms/overlays/overlays.types.ts";
import { onMounted, ref, watch} from "vue";

const props = defineProps<Countdown.Props>()
const emit = defineEmits<Countdown.Events>()

const currentTime = ref(props.duration)

let timer: number;

onMounted(() => {
    timer = setInterval(() => currentTime.value--, 1000);
})

watch(currentTime, () => {
    if (currentTime.value < 1) {
        clearInterval(timer);
        emit('complete');
    }
})
</script>

<template>
    <div class="text-h1 align-self-center text-center w-100">{{ currentTime }}</div>
</template>

<style scoped>

</style>
