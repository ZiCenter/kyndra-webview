import {
    DEFAULT_LINE_WIDTH, DEFAULT_LINE_WIDTH_GLOW,
    KEYPOINT_COLORS,
    type KeypointName,
    KEYPOINTS_PAIR_NAMES,
    TWO_PI
} from "@/utils/constants.ts";
import type {Pose, Stickpoint} from "@zicenter/kyndra";

export class CanvasRenderer {
    private ctx: CanvasRenderingContext2D;
    private scale = {x: 1, y: 1};
    private offset = {x: 0, y: 0};

    private boneStyles = {
        glow: true,
        shadow: true
    };

    constructor(
        private canvas: HTMLCanvasElement,
        private videoWidth: number,
        private videoHeight: number,
        private isFlipped: boolean = false
    ) {
        this.ctx = canvas.getContext('2d')!;
        this.init();
        this.clear();
    }

    flip() {
        this.ctx.translate(this.canvas.width, 0);
        this.ctx.scale(-1, 1);
    }

    draw(pose: Pose) {
        if (pose.stickpoints == null) return;
        this.clear();
        this.drawSkeleton(pose.stickpoints);
        this.drawKeypoints(pose.stickpoints);
    }

    private init() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        this.ctx.globalAlpha = 0.8
        this.ctx.strokeStyle = 'Blue';
        this.ctx.fillStyle = 'White';

        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = DEFAULT_LINE_WIDTH;

        this.computeVideoPreset();
        if (this.isFlipped) this.flip();
    }

    private drawKeypoints(keypoints: Record<KeypointName, Stickpoint>) {
        for (const key in keypoints) {
            this.drawKeypoint(keypoints[key as KeypointName], key as KeypointName);
        }
    }

    private drawSkeleton(keypoints: Record<KeypointName, Stickpoint>) {
        // Group bones by body part for different styling
        const bonePairs = KEYPOINTS_PAIR_NAMES.map(([i, j]) => ({
            start: keypoints[i],
            end: keypoints[j],
            startName: i,
            endName: j
        }));

        // Draw all bones with glow effect if enabled
        if (this.boneStyles.glow) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.3;
            this.ctx.filter = 'blur(4px)';
            bonePairs.forEach(pair => this.drawBone(pair.start, pair.end, pair.startName, pair.endName, true));
            this.ctx.restore();
        }

        // Draw the main bones
        bonePairs.forEach(pair => this.drawBone(pair.start, pair.end, pair.startName, pair.endName, false));
    }

    computeVideoPreset() {
        const videoRatio = this.videoWidth / this.videoHeight;
        const clientRatio = this.canvas.clientWidth / this.canvas.clientHeight;

        if (videoRatio > clientRatio) {
            // Video is wider than container: height matches, width is cropped
            this.scale = {x: this.canvas.height * videoRatio, y: this.canvas.height}
            this.offset.x = (this.scale.x - this.canvas.width) / 2;
        } else {
            // Video is taller than container: width matches, height is cropped
            this.scale = {x: this.canvas.width, y: this.canvas.width / videoRatio}
            this.offset.y = (this.scale.y - this.canvas.height) / 2;
        }
    }

    private xShift(x: number) {
        return x * this.scale.x - this.offset.x
    }

    private yShift(y: number) {
        return y * this.scale.y - this.offset.y
    }

    private clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private getKeypointColor(name: KeypointName): string {
        return KEYPOINT_COLORS[name] || KEYPOINT_COLORS.default;
    }

    private drawKeypoint(keypoint: Stickpoint, name: KeypointName) {
        const x = this.xShift(keypoint.x);
        const y = this.yShift(keypoint.y);
        const color = this.getKeypointColor(name);
        const radius = keypoint.score > 0.5 ? 6 : 4; // Size based on confidence

        // Draw glow/shadow if enabled
        if (this.boneStyles.shadow) {
            this.ctx.save();
            this.ctx.shadowColor = color;
            this.ctx.shadowBlur = 15;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius + 2, 0, TWO_PI);
            this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
            this.ctx.fill();
            this.ctx.restore();
        }

        // Draw outer ring
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, TWO_PI);
        this.ctx.fillStyle = color;
        this.ctx.fill();

        // Draw inner dot
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * 0.6, 0, TWO_PI);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fill();
    }

    private drawBone(start: Stickpoint, end: Stickpoint, startName: KeypointName, endName: KeypointName, isGlow: boolean = false) {
        if (start.score < 0.1 || end.score < 0.1) return;

        const startX = this.xShift(start.x);
        const startY = this.yShift(start.y);
        const endX = this.xShift(end.x);
        const endY = this.yShift(end.y);

        try {
            // Create gradient for the bone
            const gradient = this.ctx.createLinearGradient(startX, startY, endX, endY);
            gradient.addColorStop(0, this.getKeypointColor(startName));
            gradient.addColorStop(1, this.getKeypointColor(endName));

            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);

            if (isGlow) {
                // If drawing glow layer
                this.ctx.lineWidth = DEFAULT_LINE_WIDTH_GLOW;
                this.ctx.strokeStyle = gradient;
            } else {
                // Main bone
                this.ctx.lineWidth = DEFAULT_LINE_WIDTH;
                this.ctx.strokeStyle = gradient;

                // Add highlight effect along the bone
                if (this.boneStyles.glow) {
                    this.ctx.shadowColor = 'rgba(255,255,255,0.8)';
                    this.ctx.shadowBlur = 2;
                    this.ctx.shadowOffsetX = 0;
                    this.ctx.shadowOffsetY = 0;
                }
            }
        } catch (e) {
            console.error(e)
        }

        this.ctx.stroke();
    }

}
