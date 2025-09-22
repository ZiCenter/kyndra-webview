import type {ExerciseDto, WorkoutSessionDto} from "@/integrations/mhc-api.dto.ts";
import workoutSession from "@/assets/json/workout-session.json"
import exerciseData from "@/assets/json/exercise.json"
import {getModelData, getModels} from "@/utils/firebase.utils.ts";
import type {Exercise, WorkoutSession} from "@/utils/types.ts";

type ApiResponse<T> = {
    details: T
    success: boolean
}

class MhcApi {

    async getWorkoutSession(id: string): Promise<WorkoutSession> {
        const {success, details} = await fetch(`https://ai-staging.myhealthcop.com/internal/workout/${id}`, {
            headers: {'X-Platform': 'MHC-AI'}
        })
            .then(resp => resp.json()) as ApiResponse<WorkoutSessionDto>;
        if (!success) throw new Error(`Failed to fetch workout session: ${id}`)
        const session = this.toWorkoutSession(details);
        return {...session, models: await getModels(session.exercises)}
    }

    async mockWorkoutSession(id: string): Promise<WorkoutSession> {
        console.log(`Mocking workout session: ${id}`)
        const session = this.toWorkoutSession(workoutSession);
        return {...session, models: await getModels(session.exercises)}
    }

    async mockExercise(id: string): Promise<Exercise & { model: string }> {
        console.log(`Mocking exercise: ${id}`)
        const exercise = this.toExerciseModel(exerciseData);
        return {...exercise, model: await getModelData(id)}
    }

    private toWorkoutSession(dto: WorkoutSessionDto): Omit<WorkoutSession, 'models'> {
        return {
            id: dto.id,
            name: dto.title,
            rest: dto.rest,
            exercises: dto.exercises.map(it => this.toExerciseModel(it)),
        }
    }

    private toExerciseModel(dto: ExerciseDto): Exercise {
        return {
            id: dto.providerId,
            name: dto.name,
            type: dto.isDuration ? 'time' : 'reps',
            target: dto.isDuration ? dto.duration : dto.reps,
            rest: dto.rest,
            calories: dto.calories,
            videoUrl: dto.previewVideo,
        }
    }
}

const mhcApi = new MhcApi();
export default mhcApi;
