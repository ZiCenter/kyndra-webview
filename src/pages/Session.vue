<script setup lang="ts">
import ExerciseView from "@/components/organisms/ExerciseView.vue";
import RestView from "@/components/organisms/RestView.vue";
import mhcApi from "@/integrations/mhc-api.ts";
import {MessageRouter} from "@/services/messaging.service.ts";
import type {WorkoutSession, SessionSummary} from "@/utils/types.ts";
import {computed, inject, onMounted, ref} from "vue";
import {useRoute} from "vue-router";

const route = useRoute()

const sessionData = ref<WorkoutSession>()

const status = ref<'workout' | 'rest'>('workout')
const index = ref<number>(0)
const summaries = ref<SessionSummary[]>([])

const messaging = inject<MessageRouter>('messaging')!

onMounted(async () => {
    sessionData.value = await mhcApi.getWorkoutSession(route.params.id as string);
    messaging.send('session-loaded')

    // Listen for navigation commands
    messaging.on('command-next', () => skipToNext());
    messaging.on('command-previous', () => skipToPrevious());
    messaging.on('exercise-completed', onExerciseCompleted)
})

const onExerciseCompleted = (summary: SessionSummary) => {
    summaries.value.push(summary)

    if (isLast.value) {
        messaging.send('session-completed', {status: 'completed', summary: summaries.value})
        return;
    }
    status.value = 'rest'
}

const onRestComplete = () => {
    index.value++;
    status.value = 'workout'
    messaging.send('session-next', currentExercise.value!!)
}

const isLast = computed(() => sessionData.value ? index.value >= sessionData.value.models.length - 1 : false)

const currentExercise = computed(() => sessionData.value ? sessionData.value.exercises[index.value] : undefined)

const currentModel = computed(() => sessionData.value ? sessionData.value.models[index.value] : undefined)

const next = computed(() => sessionData.value ? sessionData.value.exercises[index.value + 1] : undefined)

const skipToNext = () => {
    if (isLast.value) return;

    index.value++;
    status.value = 'workout';
    messaging.send('session-skipped-to-next');
    messaging.send('session-next', currentExercise.value!!);
}

const skipToPrevious = () => {
    if (index.value <= 0) return;

    // Remove the last summary if we're going back
    if (summaries.value.length > 0) {
        summaries.value.pop();
    }

    index.value--;
    status.value = 'workout';
    messaging.send('session-skipped-to-previous');
    messaging.send('session-next', currentExercise.value!!);
}

const currentSummary = computed(() => summaries.value[summaries.value.length - 1] || { reps: [], accuracy: 0, calories: 0 })
</script>

<template>
    <RestView
        v-if="status === 'rest'"
        :duration="currentExercise?.rest || 0"
        :next-name="next?.name"
        :next-video-url="next?.videoUrl"
        :reps="currentSummary.reps.length"
        :accuracy="currentSummary.accuracy"
        :calories="currentSummary.calories"
        @complete="onRestComplete"
    />
    <ExerciseView
        v-else-if="currentExercise && currentModel"
        :key="index"
        :model="currentModel"
        :exercise="currentExercise"
        :count="0"
    />
</template>

<style scoped>

</style>
