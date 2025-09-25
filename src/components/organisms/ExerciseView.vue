<script setup lang="ts">
import Overlay from "@/components/atoms/Overlay.vue";
import Camera from "@/components/atoms/overlays/Camera.vue";
import Canvas from "@/components/atoms/overlays/Canvas.vue";
import Pose from "@/components/atoms/overlays/Pose.vue";
import TimedScoreCard from "@/components/atoms/overlays/TimedScoreCard.vue";
import RepScoreCard from "@/components/atoms/overlays/RepScoreCard.vue";
import WorkoutVideo from "@/components/atoms/overlays/WorkoutVideo.vue";
import {MessageRouter} from "@/services/messaging.service.ts";
import {WorkflowManager} from "@/services/workflow.manager.ts";
import type {Exercise, RepSummary, SessionSummary} from "@/utils/types.ts";
import {computed, inject, onMounted, onUnmounted, ref, useTemplateRef, watch} from "vue";
import {WorkflowResult, PoseInput, CycleDetected} from "@zicenter/kyndra";

const messaging = inject<MessageRouter>('messaging')!
const manager = new WorkflowManager(messaging, inject<PoseInput>('input')!)

const props = defineProps<{ model: string, exercise: Exercise, count: number, isPaused?: boolean }>()
const emit = defineEmits<{ ready: [], result: [WorkflowResult], complete: [SessionSummary] }>()

const camera = useTemplateRef<{ el: HTMLVideoElement }>('camera')

const showCanvas = ref(false)
const canvasKey = ref(0)
const status = ref<'initializing'|'aligning'|'countdown'|'started'>('initializing')

const reps = ref<RepSummary[]>([])

const accuracy = computed(() => reps.value.length > 0 ? reps.value.reduce((a, b) => a + b.score, 0) / reps.value.length : 0)
const calories = computed(() => (props.exercise.calories || 0) * reps.value.length)

messaging.on('exercise-aligned', () => {
    status.value = 'countdown'
    canvasKey.value++
})

onMounted(async () => {
    if (!camera.value?.el) return;
    await manager.loadFromJson(props.model)
    await manager.setVideo(camera.value.el!);
    status.value = 'aligning'
    await manager.runPoseVerifier();
    messaging.on('result', onResult)
})

onUnmounted(() => manager.destroy())

const onResult = (result: WorkflowResult) => {
    if (!result.data || result.data.__type !== 'CycleDetected') return;
    const data = result.data! as CycleDetected;
    reps.value.push({score: data.score, states: data.stateScores});
}

const createSessionSummary = (): SessionSummary => {
    return {
        id: props.exercise.id,
        reps: reps.value,
        time: props.exercise.target,
        calories: calories.value,
        accuracy: accuracy.value,
    }
}

const onCountdownComplete = () => {
    status.value = 'started';
    canvasKey.value++
    manager.run();
    messaging.send('exercise-started', props.exercise)
}

const onExerciseComplete = () => {
    const summary = createSessionSummary()

    messaging.send('exercise-completed', summary)
    emit('complete', summary)
}

const context = computed(() => JSON.parse(props.model).__c || {})
const mask = computed(() => context.value?.referenceSilhouette)
</script>

<template>
    <v-container fluid class="fill-height">
        <Overlay>
            <Camera ref="camera" @ready="showCanvas = true"/>
        </Overlay>

        <Overlay v-if="showCanvas && camera">
            <Canvas :key="canvasKey" :video-width="camera.el.videoWidth" :video-height="camera.el.videoHeight"/>
        </Overlay>

        <Overlay v-if="status === 'aligning'">
            <Pose :mask="mask" />
        </Overlay>

        <Overlay v-if="status === 'countdown' || status === 'started'">
            <WorkoutVideo
                :url="exercise.videoUrl"
                :name="exercise.name"
                :countdown="5"
                :is-paused="isPaused"
                @complete="onCountdownComplete"
            />
        </Overlay>

        <Overlay v-if="status === 'started'">
            <TimedScoreCard
                v-if="exercise.type === 'time'"
                :value="count"
                :duration="exercise.target"
                :is-paused="isPaused"
                @complete="onExerciseComplete"
            />
            <RepScoreCard
                v-else-if="exercise.type === 'reps'"
                :value="count"
                :target="exercise.target"
                :is-paused="isPaused"
                @complete="onExerciseComplete"
            />
        </Overlay>
    </v-container>
</template>
