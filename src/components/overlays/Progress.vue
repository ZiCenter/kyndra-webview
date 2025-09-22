<script setup lang="ts">
import type { Progress } from "@/components/overlays.types.ts";
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";

const props = defineProps<Progress.Props>()
const emit = defineEmits<Progress.Events>()

const currentTime = ref(0)

const value = computed(() => props.target ? (props.value || currentTime.value) / props.target * 100 : 0)

let interval: number;

onMounted(() => {
    if (!props.target || props.value !== undefined) return;
    interval = setInterval(() => currentTime.value++, 1000);
})

watch(currentTime, () => {
    if (props.target && currentTime.value >= props.target && interval) {
        clearInterval(interval);
        emit('complete');
    }
})

onBeforeUnmount(() => {
    if (interval) clearInterval(interval)
})
</script>

<template>
    <v-progress-linear :model-value="value" :height="12" striped :indeterminate="!target"/>
</template>

<style scoped>

</style>
