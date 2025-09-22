import type {ComponentTypeEmits} from "@vue/runtime-core";
import type WorkoutVideo from "./overlays/WorkoutVideo.vue";

type EmitObjectToFunctionMap<T extends Record<string, any>> = {
    [K in keyof T]: (...args: T[K]) => void;
};

type OverlayItem<
    TProps extends Record<string, any>,
    TEvents extends ComponentTypeEmits
> = {
    props: TProps;
    events: Partial<EmitObjectToFunctionMap<TEvents>>;
}

export namespace Progress {
    export type Props = {
        value?: number;
        target?: number;
    }

    export type Events = {
        'complete': [];
    }

    export type Overlay = OverlayItem<Props, Events>
}

export namespace Countdown {
    export type Props = {
        duration: number;
    }

    export type Events = {
        complete: [];
    }

    export type Overlay = OverlayItem<Props, Events>
}


export namespace Pose {
    export type Props = {
        pose: string;
    }

    export type Events = {}

    export type Overlay = OverlayItem<Props, Events>
}

export namespace ScoreCard {
    export type Props = {
        value: number;
        target: number;
    }

    export type Events = {}

    export type Overlay = OverlayItem<Props, Events>
}

export namespace TimedScoreCard {
    export type Props = {
        value: number;
        duration: number;
    }

    export type Events = {
        complete: [];
    }

    export type Overlay = OverlayItem<Props, Events>
}

export namespace RepScoreCard {
    export type Props = {
        value: number;
        target: number;
    }

    export type Events = {
        complete: [];
    }

    export type Overlay = OverlayItem<Props, Events>
}

export namespace WorkoutVideo {
    export type Props = {
        url: string;
        name: string;
        preview: boolean;
    }

    export type Events = {
        complete: [];
    }

    export type Overlay = OverlayItem<Props, Events>
}

type Overlays = {
    Progress: Progress.Overlay;
    Countdown: Countdown.Overlay;
    Pose: Pose.Overlay;
    ScoreCard: ScoreCard.Overlay;
    TimedScoreCard: TimedScoreCard.Overlay;
    RepScoreCard: RepScoreCard.Overlay;
    WorkoutVideo: WorkoutVideo.Overlay;
}

export type OverlayConfig = {
    [K in keyof Overlays]: {
        name: K;
        props: Overlays[K]['props'];
        events: Overlays[K]['events'];
    }
}[keyof Overlays];
