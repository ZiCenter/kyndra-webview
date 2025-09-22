<script setup lang="ts">
import {ref} from "vue";

const emit = defineEmits(['complete'])

const ready = ref(false)

setTimeout(() => {
    ready.value = true;
    emit('complete')
}, 1000)
</script>

<template>
    <v-container fluid class="fill-height bg-black">
        <v-img src="@/assets/ai-wave.gif" contain width="100%"></v-img>
        <div v-if="ready" class="d-flex justify-center w-100 px-16">
            <v-btn
                variant="outlined" rounded="pill"
                class="text-none"
                append-icon="mdi-arrow-right-circle-outline"
                @click="$emit('complete')"
            >
                Let's Go
                <template v-slot:append>
                    <v-icon color="warning"/>
                </template>
            </v-btn>
        </div>
        <div v-else class="text-subtitle-1 font-weight-light mb-6 text-center w-100">Getting ready...</div>
<!--        <div class="lines">-->
<!--            <div class="line"></div>-->
<!--            <div class="line"></div>-->
<!--            <div class="line"></div>-->
<!--            <div class="line"></div>-->
<!--            <div class="line"></div>-->
<!--            <div class="line"></div>-->
<!--            <div class="line"></div>-->
<!--            <div class="line"></div>-->
<!--            <div class="line"></div>-->
<!--            <div class="line"></div>-->
<!--        </div>-->
    </v-container>
</template>

<style scoped>
.lines {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    margin: auto;
    width: 90vw;
    display: flex;
    justify-content: space-between; /* Distribute lines evenly */
}

.line {
    position: relative;
    width: 1px;
    height: 100%;
    /*background: #ffffff;  /* Line color */
    overflow: hidden;
}

.line::after {
    content: '';
    display: block;
    position: absolute;
    height: 15vh;
    width: 100%;
    top: -50%;
    left: 0;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #ffffff 75%, #ffffff 100%);
    animation: drop 4s 0s infinite;
    animation-fill-mode: forwards;
    animation-timing-function: cubic-bezier(0, 0.26, 0, 0.97);
}

/* Different colors for each line's pseudo-element */
.line:nth-child(1)::after {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #FF4500 75%, #FF4500 100%);
}

.line:nth-child(2)::after {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #32CD32 75%, #32CD32 100%);
    animation-delay: 0.5s;
}

.line:nth-child(3)::after {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #1E90FF 75%, #1E90FF 100%);
    animation-delay: 1s;
}

.line:nth-child(4)::after {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #FFD700 75%, #FFD700 100%);
    animation-delay: 1.5s;
}

.line:nth-child(5)::after {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #8A2BE2 75%, #8A2BE2 100%);
    animation-delay: 2s;
}

.line:nth-child(6)::after {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #20B2AA 75%, #20B2AA 100%);
    animation-delay: 2.5s;
}

.line:nth-child(7)::after {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #DC143C 75%, #DC143C 100%);
    animation-delay: 3s;
}

.line:nth-child(8)::after {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #00FA9A 75%, #00FA9A 100%);
    animation-delay: 3.5s;
}

.line:nth-child(9)::after {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #FF1493 75%, #FF1493 100%);
    animation-delay: 4s;
}

.line:nth-child(10)::after {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #00BFFF 75%, #00BFFF 100%);
    animation-delay: 4.5s;
}

@keyframes drop {
    0% {
        top: -50%;
    }
    100% {
        top: 110%;
    }
}
</style>
