import type {SessionSummary} from "@/utils/types.ts";
import {WorkflowResult} from "@zicenter/kyndra";

export type ConnectionEvents = {
    'connected': () => void;
    'disconnect': () => void;
}

export type WorkflowEvents = {
    'result': (data: WorkflowResult) => void;
    'exercise-initialized': () => void;
    'exercise-started': (data: ExercisePayload) => void;
    'exercise-destroyed': () => void;
    'exercise-aligned': () => void;
    'exercise-completed': (data: SessionSummary) => void;
    'exercise-paused': () => void;
    'exercise-resumed': () => void;
}

export type SessionEvents = {
    'session-loaded': () => void;
    'session-completed': (data: SessionCompleted) => void;
    'session-next': (data: ExercisePayload) => void;
    'session-skipped-to-next': () => void;
    'session-skipped-to-previous': () => void;
}

export type InboundCommandEvents = {
    'command-pause': () => void;
    'command-resume': () => void;
    'command-next': () => void;
    'command-previous': () => void;
}

export type MessagingEvents = ConnectionEvents & WorkflowEvents & SessionEvents & InboundCommandEvents;

type SessionCompleted = {
    summary: SessionSummary[];
    status: 'completed' | 'aborted';
}

type ExercisePayload = {
    id: string,
    name: string,
    type: 'reps' | 'time'
    target: number,
    rest: number,
    videoUrl: string,
}


