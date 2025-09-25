<script setup lang="ts">
import ExerciseView from "@/components/organisms/ExerciseView.vue";
import RestView from "@/components/organisms/RestView.vue";
import mhcApi from "@/integrations/mhc-api.ts";
import {MessageRouter} from "@/services/messaging.service.ts";
import type {WorkoutSession, SessionSummary} from "@/utils/types.ts";
import {computed, inject, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {WorkflowResult, CycleDetected} from "@zicenter/kyndra";

const route = useRoute()

const sessionData = ref<WorkoutSession>()

const status = ref<'workout' | 'rest'>('workout')
const index = ref<number>(0)
const reps = ref<SessionSummary['reps']>([])
const summaries = ref<SessionSummary[]>([])

const messaging = inject<MessageRouter>('messaging')!

onMounted(async () => {
    sessionData.value = await mhcApi.getWorkoutSession(route.params.id as string);
    messaging.send('session-loaded')

    // Listen for navigation commands
    messaging.on('command-next', () => skipToNext());
    messaging.on('command-previous', () => skipToPrevious());
})

const onResult = (result: WorkflowResult) => {
    if (!result.data || result.data.__type !== 'CycleDetected') return;
    const data = result.data! as CycleDetected;
    reps.value.push({score: data.score, states: data.stateScores});
}

const onRestComplete = () => {
    index.value++;
    status.value = 'workout'
    reps.value = []
    messaging.send('session-next', currentExercise.value!!)
}

const addSummary = () => {
    summaries.value.push({
        id: currentExercise.value?.id || '',
        reps: reps.value,
        time: currentExercise.value?.target || 0,
        calories: calories.value,
        accuracy: accuracy.value,
    })
}

const accuracy = computed(() => reps.value.reduce((a, b) => a + b.score, 0) / reps.value.length)

const calories = computed(() => (currentExercise.value?.calories || 0) * reps.value.length)

const isLast = computed(() => sessionData.value ? index.value >= sessionData.value.models.length - 1 : false)

const currentExercise = computed(() => sessionData.value ? sessionData.value.exercises[index.value] : undefined)

const currentModel = computed(() => sessionData.value ? sessionData.value.models[index.value] : undefined)

const next = computed(() => sessionData.value ? sessionData.value.exercises[index.value + 1] : undefined)

const onExerciseComplete = () => {
    addSummary()
    if (isLast.value) {
        messaging.send('session-completed', {status: 'completed', summary: summaries.value})
        return;
    }
    status.value = 'rest'
}

const skipToNext = () => {
    if (isLast.value) return;

    // If currently in workout, add current progress to summary before skipping
    if (status.value === 'workout') {
        addSummary();
    }

    index.value++;
    status.value = 'workout';
    reps.value = [];
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
    reps.value = [];
    messaging.send('session-skipped-to-previous');
    messaging.send('session-next', currentExercise.value!!);
}
</script>

<template>
    <RestView
        v-if="status === 'rest'"
        :duration="currentExercise?.rest || 0"
        :next-name="next?.name"
        :next-video-url="next?.videoUrl"
        :reps="reps.length"
        :accuracy="accuracy"
        :calories="calories"
        @complete="onRestComplete"
    />
    <ExerciseView
        v-else-if="currentExercise && currentModel"
        :key="index"
        :model="currentModel"
        :exercise="currentExercise"
        :count="reps.length"
        @result="onResult"
        @complete="onExerciseComplete"
    />
</template>

<style scoped>

</style>
