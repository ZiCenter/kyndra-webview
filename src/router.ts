import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'
import Index from "@/pages/Index.vue";
import Exercise from "@/pages/Exercise.vue";
import Session from "@/pages/Session.vue";

const routes: RouteRecordRaw[] = [
    {path: '', component: Index},
    {path: '/exercise/:id', component: Exercise},
    {path: '/session/:id', component: Session},
]

export const router = createRouter({history: createWebHistory(), routes,})
