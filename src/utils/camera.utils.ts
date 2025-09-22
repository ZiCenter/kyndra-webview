import {isMobile} from "@/utils/functions.ts";
import {FRAME_RATE, VIDEO_SIZE} from "./constants.ts";

let stream: MediaStream | null = null;
let facingMode = 'user';

export async function initCamera(videoElement: HTMLVideoElement): Promise<void> {
  if (!videoElement) {
    console.error('Video element not found');
    return;
  }

  try {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    const dims = VIDEO_SIZE[isMobile() ? '360 X 270' : '640 X 480']

    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: facingMode,
        ...dims,
        frameRate: {max: FRAME_RATE},
        backgroundBlur: true
      },
      audio: false
    });

    videoElement.srcObject = stream;
    console.log("Video element loaded");
  } catch (error) {
    console.error('Error accessing camera:', error);
  }
}

export async function switchCamera(elem: HTMLVideoElement): Promise<void> {
  facingMode = facingMode === 'user' ? 'environment' : 'user';
  await initCamera(elem);
}

export function dispose(): void {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
}
