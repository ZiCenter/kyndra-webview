<script setup lang="ts">
import BubbleProgress from "@/components/atoms/BubbleProgress.vue";
import type {RepScoreCard} from "@/components/atoms/overlays/overlays.types.ts";
import {useQueryConfig} from "@/composables/useQueryConfig.ts";
import {useChimeAudio} from "@/composables/useAudio.ts";
import {computed, ref, watch} from "vue";

const chimeAudio = useChimeAudio()

const props = defineProps<RepScoreCard.Props>()
const emit = defineEmits<RepScoreCard.Events>()

const config = useQueryConfig()

const percentage = computed(() => props.value / props.target * 100)

watch(() => props.value, (newValue, oldValue) => {
    if (newValue <= oldValue) {
        return;
    }

    chimeAudio.play()

    if (newValue >= props.target) {
        setTimeout(() => emit('complete'), 500)
    }
})

</script>

<template>
    <v-container fluid class="app d-flex flex-column fill-height">
        <v-card v-if="config.ui" height="60px" flat class="container d-flex align-center position-absolute border mx-6 mb-6">
            <v-progress-linear :model-value="percentage" color="amber" height="100%">
                <div class="text-center">
                    <span class="text-h4 font-weight-bold mr-2 text-high-emphasis">{{ value }}</span>
                    <span class="text-h5 font-weight-semibold text-uppercase text-high-emphasis">/ {{ target }}</span>
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

.container {
    left: 3px;
    right: 3px;
    bottom: 3px;
    border-radius: 30px;
    padding: 1px;
    background-color: rgba(255, 255, 255, 0.19);
}
</style>
