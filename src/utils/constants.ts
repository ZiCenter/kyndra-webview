
export type KeypointName = string; // TODO: Import right component

export const DEFAULT_LINE_WIDTH = 3;
export const DEFAULT_LINE_WIDTH_GLOW = 3 * 2.5;
export const DEFAULT_RADIUS = 3;
export const TWO_PI = 2 * Math.PI;

export const VIDEO_SIZE = {
  '640 X 480': {width: 640, height: 480},
  '360 X 270': {width: 360, height: 270}
};
export const FRAME_RATE = 25;

export const KEYPOINTS_PAIR_NAMES: [KeypointName, KeypointName][] = [
  // [0, 1]
  ["nose", "left_eye_inner"],
  // [0, 4]
  ["nose", "right_eye_inner"],
  // [1, 2]
  ["left_eye_inner", "left_eye"],
  // [2, 3]
  ["left_eye", "left_eye_outer"],
  // [3, 7]
  ["left_eye_outer", "left_ear"],
  // [4, 5]
  ["right_eye_inner", "right_eye"],
  // [5, 6]
  ["right_eye", "right_eye_outer"],
  // [6, 8]
  ["right_eye_outer", "right_ear"],
  // [9, 10]
  ["mouth_left", "mouth_right"],
  // [11, 12]
  ["left_shoulder", "right_shoulder"],
  // [11, 13]
  ["left_shoulder", "left_elbow"],
  // [11, 23]
  ["left_shoulder", "left_hip"],
  // [12, 14]
  ["right_shoulder", "right_elbow"],
  // [14, 16]
  ["right_elbow", "right_wrist"],
  // [12, 24]
  ["right_shoulder", "right_hip"],
  // [13, 15]
  ["left_elbow", "left_wrist"],
  // [15, 17]
  ["left_wrist", "left_pinky"],
  // [16, 18]
  ["right_wrist", "right_pinky"],
  // [16, 20]
  ["right_wrist", "right_index"],
  // [15, 17] Duplicate pair
  ["left_wrist", "left_pinky"],
  // [15, 19]
  ["left_wrist", "left_index"],
  // [15, 21]
  ["left_wrist", "left_thumb"],
  // [16, 22]
  ["right_wrist", "right_thumb"],
  // [17, 19]
  ["left_pinky", "left_index"],
  // [18, 20]
  ["right_pinky", "right_index"],
  // [23, 25]
  ["left_hip", "left_knee"],
  // [23, 24]
  ["left_hip", "right_hip"],
  // [24, 26]
  ["right_hip", "right_knee"],
  // [25, 27]
  ["left_knee", "left_ankle"],
  // [26, 28]
  ["right_knee", "right_ankle"],
  // [27, 29]
  ["left_ankle", "left_heel"],
  // [28, 30]
  ["right_ankle", "right_heel"],
  // [27, 31]
  ["left_ankle", "left_foot_index"],
  // [28, 32]
  ["right_ankle", "right_foot_index"],
  // [29, 31]
  ["left_heel", "left_foot_index"],
  // [30, 32]
  ["right_heel", "right_foot_index"],
];

export const KEYPOINT_COLORS: Partial<Record<KeypointName, string>> & { default: string } = {
  // Head region
  nose: '#FF5733',
  left_eye: '#FF5733',
  right_eye: '#FF5733',
  left_ear: '#FF5733',
  right_ear: '#FF5733',

  // Arms region
  left_shoulder: '#33FF57',
  right_shoulder: '#33FF57',
  left_elbow: '#33FF57',
  right_elbow: '#33FF57',
  left_wrist: '#33FF57',
  right_wrist: '#33FF57',

  // Legs region
  left_hip: '#D433FF',
  right_hip: '#D433FF',
  left_knee: '#D433FF',
  right_knee: '#D433FF',
  left_ankle: '#D433FF',
  right_ankle: '#D433FF',

  // Torso (if any other points)
  // Add any other keypoints your model might use
  default: '#33A8FF',
};

export const EXTERNAL_URLS = {
  REST_BACKGROUND_AUDIO: 'https://firebasestorage.googleapis.com/v0/b/mhc-main-project.firebasestorage.app/o/audios%2Fbackground_music.mp3?alt=media&token=8fbccf70-c272-49e8-a1b0-210b799c1959'
};
