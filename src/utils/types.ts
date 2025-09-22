import EventEmitter from "eventemitter3";
import type TypedEmitter from "typed-emitter";
import {type EventMap} from "typed-emitter";

export type WorkoutSession = {
    id: string,
    name: string,
    rest: number,
    exercises: Exercise[]
    models: string[]
}

export type Exercise = {
    id: string,
    name: string,
    type: 'reps' | 'time'
    target: number,
    rest: number,
    calories: number,
    videoUrl: string,
}

export type SessionSummary = {
    id: string,
    reps: RepSummary[],
    time: number,
    calories: number,
    accuracy: number,
}

export type RepSummary = {
    score: number;
    states: any
}

export class TypedEventEmitter<T extends EventMap>
    extends (EventEmitter as unknown as { new<T extends EventMap>(): TypedEmitter<T> })<T> {
}
