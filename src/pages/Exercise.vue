<script setup lang="ts">
import ExerciseView from "@/components/organisms/ExerciseView.vue";
import mhcApi from "@/integrations/mhc-api.ts";
import type {Exercise, RepSummary} from "@/utils/types.ts";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {CycleDetected, WorkflowResult} from "@zicenter/kyndra";

const route = useRoute()
const exercise = ref<Exercise & { model: string }>()

const reps = ref<RepSummary[]>([])

onMounted(async () => exercise.value = await mhcApi.mockExercise(route.params.id as string))

const onResult = (result: WorkflowResult) => {
    if (!result.data || result.data.__type !== 'CycleDetected') return;
    const data = result.data! as CycleDetected;
    reps.value.push({score: data.score, states: data.stateScores});
}

const onExerciseComplete = () => {
    alert("done")
}
</script>

<template>
    <ExerciseView
        v-if="exercise"
        :exercise="exercise"
        :model="exercise.model"
        :count="reps.length"
        @result="onResult"
        @complete="onExerciseComplete"
    />
</template>
