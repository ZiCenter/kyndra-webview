<script setup lang="ts">
import '@/assets/css/water-ball.css'
import {computed} from "vue";

const props = defineProps<{ value: number, total: number, label?: string }>();

const level = computed(() => 100 - props.value / props.total * 100)
</script>

<template>
    <v-sheet
        width="100%" height="100%" rounded="circle"
        :elevation="3"
        class="overflow-hidden position-relative d-flex flex-column justify-center align-center">
        <div class="circle-container bg-surface-light">
            <div class="wave" v-for="i in 3" :key="i" :style="{'top': `${level}%`}" />
            <div class="wave-below" :style="{'top': `${level + 8}%`}" />
            <div v-if="label" class="d-flex flex-column text-high-emphasis justify-center align-center">
                <div class="text-start">
                    <span class="text-h2 font-weight-bold mr-2">{{ value }}</span>
                    <span class="text-h6 font-weight-light text-uppercase">/ {{ total }}</span>
                </div>
                <div class="text-subtitle-1 font-weight-light">Secs</div>
            </div>
            <div class="circle bg-transparent"></div>
        </div>
    </v-sheet>
</template>

<style scoped>

</style>
