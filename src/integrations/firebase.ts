import type {Exercise, WorkoutSession} from "@/utils/types.ts";
import {type FirebaseApp, type FirebaseOptions, initializeApp} from 'firebase/app';
import {Firestore, getFirestore, doc, getDoc} from 'firebase/firestore';
import {type FirebaseStorage, getStorage, getBytes, ref} from 'firebase/storage';


let storage: FirebaseStorage;

let storageRoot = 'ai_portal_data'

const createInstance = (config: FirebaseOptions) => {
    storage = getStorage(initializeApp(config));
}

const toString = (buffer: ArrayBuffer) => new TextDecoder().decode(buffer);

export const getModelData = async (id: string) => {
    return toString(await getBytes(ref(storage, `${storageRoot}/models/${id}.json`)));
}

export const getModels = async (exercises: Pick<Exercise, 'id'>[]) => {
    return await Promise.all(
        exercises.map((exercise) => getModelData(exercise.id))
    );
}

createInstance({
    apiKey: "AIzaSyCWxLJbuXxTVGGCqHZ2a_h4xrdZj4BjQLM",
    authDomain: "mhc-main-project.firebaseapp.com",
    projectId: "mhc-main-project",
    storageBucket: "mhc-main-project.firebasestorage.app",
    messagingSenderId: "84567321201",
    appId: "1:84567321201:web:9bfe9e2ef53e8e2905c9d0",
    measurementId: "G-8HTNQEYD6F"
})
