<script setup lang="ts">
defineProps<{ transform: string }>()
</script>

<template>
    <div class="phone-container">
        <div class="target-line"/>
        <div class="phone" :style="{ transform }"/>
    </div>
</template>

<style scoped>
.phone-container {
    position: relative;
    width: 200px;
    height: 200px;
    margin: 0 auto 40px;
    animation: fadeInUp 1s ease-out 0.9s both;
}

.phone {
    width: 70px;
    height: 140px;
    background: #333;
    border-radius: 16px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 2px solid #555;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.phone::before {
    content: '';
    position: absolute;
    top: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 4px;
    background: #666;
    border-radius: 3px;
}

.phone::after {
    content: '';
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 10px;
    background: #666;
    border-radius: 50%;
}

.target-line {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2px;
    height: 160px;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    border-radius: 1px;
}

.target-line::before,
.target-line::after {
    content: '';
    position: absolute;
    left: 50%;
    width: 20px;
    height: 2px;
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(-50%);
}

.target-line::before {
    top: -10px;
}

.target-line::after {
    bottom: -10px;
}
</style>
