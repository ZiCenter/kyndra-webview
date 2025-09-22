export interface WorkoutSessionDto {
    id: string
    title: string
    provider: string
    duration: number
    calories: number
    rest: number
    exercises: ExerciseDto[]
}

export interface ExerciseDto {
    id: string
    providerId: string
    name: string
    isDuration: boolean
    duration: number
    reps: number
    rest: number
    calories: number
    previewVideo: string
    previewImage: string
}
