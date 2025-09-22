import Countdown from "@/components/overlays/Countdown.vue";
import Pose from "@/components/overlays/Pose.vue";
import Progress from "@/components/overlays/Progress.vue";
import TimedScoreCard from "@/components/overlays/TimedScoreCard.vue";
import RepScoreCard from "@/components/overlays/RepScoreCard.vue";
import WorkoutVideo from "@/components/overlays/WorkoutVideo.vue";

export const asyncComponents = {
    Progress,
    Countdown,
    Pose,
    ScoreCard: TimedScoreCard,
    TimedScoreCard,
    RepScoreCard,
    WorkoutVideo
}
