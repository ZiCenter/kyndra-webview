import {Response} from '@zicenter/kyndra'

export type CorrectionData = {
  direction: 'left' | 'right'
  type: 'turn' | 'move-back' | 'shift' | null
}

export function handleError(error: Response) {
  const corrections: CorrectionData = {type: null, direction: 'right'}
  switch (error.__type) {
    case 'KeypointsOutOfFrame':
      corrections.type = 'move-back';
      let hasLeft = (error as any).keypoints.some((kp: string) => kp.startsWith('left'));
      let hasRight = (error as any).keypoints.some((kp: string) => kp.startsWith('right'));
      if ((hasLeft && hasRight) || !(hasLeft && hasRight)) {
        corrections.type = 'move-back';
      } else {
        corrections.type = 'shift';
        corrections.direction = hasLeft ? 'left' : 'right';
      }
      break;
    case 'AlignmentAdjustment':
      corrections.type = 'turn';
      corrections.direction = (error as any).angle < 0 ? 'left' : 'right';
      break;
    default:
      return;
  }
  return corrections;
}
