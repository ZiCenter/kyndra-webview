<script setup lang="ts">
import { ref, onMounted } from 'vue'

const particles = ref<any[]>([])

const createParticles = () => {
    particles.value = []
    for (let i = 0; i < 15; i++) {
        particles.value.push({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 6,
            duration: 4 + Math.random() * 4
        })
    }
}

onMounted(createParticles)
</script>

<template>
    <div class="floating-particles">
        <div
            v-for="particle in particles"
            :key="particle.id"
            class="particle"
            :style="{
        left: particle.left + '%',
        animationDelay: particle.delay + 's',
        animationDuration: particle.duration + 's'
      }"
        />
    </div>
</template>

<style scoped>
.floating-particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
}

.particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(68, 68, 68, 0.57);
    border-radius: 50%;
    animation: float 6s infinite linear;
}

@keyframes float {
    from {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    to {
        transform: translateY(-10px) rotate(360deg);
        opacity: 0;
    }
}
</style>
