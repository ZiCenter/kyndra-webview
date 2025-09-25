import type {MessageRouter} from "@/services/messaging.service.ts";
import type {WorkflowEvents} from "@/types/messaging.types.ts";
import {filter, firstValueFrom, Observable, Subscription} from "rxjs";
import {WorkflowResult, type Pose, PoseInput, MoveAI, type Workflow} from "@zicenter/kyndra";

export class WorkflowManager {
    private sdk: MoveAI | null = null;
    private workflow: Workflow | null = null;
    private subscription: Subscription | null = null;
    private input$!: Observable<Pose>;
    private isPaused: boolean = false;

    constructor(private messaging: MessageRouter, private input: PoseInput) {
        // Listen for pause/resume commands
        this.messaging.on('command-pause', () => this.pause());
        this.messaging.on('command-resume', () => this.resume());
    }

    async setVideo(videoElement: HTMLVideoElement) {
        await this.input.init()
        this.input$ = this.input.createObservable(videoElement);
    }

    async loadFromJson(json: string): Promise<void> {
        try {
            this.sdk = MoveAI.fromJSON(json);
            this.workflow = this.sdk.predictor;
            await this.workflow?.init();
        } catch (error) {
            console.error('Error initializing workflow:', error);
            throw error;
        }
        this.messaging.send('exercise-initialized')
    }

    async runPoseVerifier(): Promise<void> {
        if (!this.sdk) {
            console.error('SDK not initialized');
            return;
        }

        try {
            const verifierWorkflow = this.sdk.poseVerifier;
            await verifierWorkflow.init();
            try {
                const data: WorkflowResult = await firstValueFrom(verifierWorkflow.run(this.input$).pipe(filter(result => !!result.data)));
                if (!data.data) return;
                console.log('Pose aligned, cleaning up verifier');
                this.messaging.send('exercise-aligned');
            } catch (error) {
                console.error('Pose verifier error:', error);
                this.subscription = null;
            } finally {
                verifierWorkflow.destroy();
            }
        } catch (error) {
            console.error('Error starting pose verifier:', error);
        }
    }

    run(): void {
        if (!this.workflow) {
            console.error('Workflow not initialized or video element not available');
            return;
        }

        if (this.isPaused) {
            console.log('Workflow is paused, not starting');
            return;
        }

        // Clean up any existing subscription first
        this.subscription?.unsubscribe();
        this.subscription = null;

        console.log('Starting predictor workflow');
        this.subscription = this.workflow
            .run(this.input$)
            .subscribe({
                next: (data: WorkflowResult) => {
                    if (!this.isPaused) this.messaging.send('result', data);
                },
                error: (err: Error) => {
                    console.error('Workflow error:', err);
                    this.subscription?.unsubscribe();
                    this.subscription = null;
                },
                complete: () => {
                    console.log('Workflow completed');
                    this.subscription = null;
                }
            });
    }

    private pause(): void {
        this.isPaused = true;
        this.subscription?.unsubscribe();
        this.subscription = null;
        this.messaging.send('exercise-paused');
    }

    private resume(): void {
        this.isPaused = false;
        if (this.workflow && this.input$) this.run();
        this.messaging.send('exercise-resumed');
    }

    destroy(): void {
        this.subscription?.unsubscribe();
        this.workflow?.destroy();
        this.input.destroy();
        this.messaging.removeAllListeners();

        this.messaging.send('exercise-destroyed');
    }
}
