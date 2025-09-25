<script setup lang="ts">
import ExerciseView from "@/components/organisms/ExerciseView.vue";
import mhcApi from "@/integrations/mhc-api.ts";
import {MessageRouter} from "@/services/messaging.service.ts";
import type {Exercise, SessionSummary} from "@/utils/types.ts";
import {inject, onMounted, ref} from "vue";
import {useRoute} from "vue-router";

const route = useRoute()
const exercise = ref<Exercise & { model: string }>()
const exerciseSummary = ref<SessionSummary>()

const messaging = inject<MessageRouter>('messaging')!

onMounted(async () => {
    exercise.value = await mhcApi.mockExercise(route.params.id as string);
})

const onExerciseComplete = (summary: SessionSummary) => {
    exerciseSummary.value = summary
    alert("Exercise completed! Check console for summary.")
    console.log("Exercise Summary:", summary)
}
</script>

<template>
    <ExerciseView
        v-if="exercise"
        :exercise="exercise"
        :model="exercise.model"
        :count="0"
        @complete="onExerciseComplete"
    />
</template>
