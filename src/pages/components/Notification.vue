<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    color: {
        type: String,
        default: 'default'
    }
});
</script>

<template>
    <section class="notification-container">
        <section :style="{ color: `var(--${color}-color)` }" class="message-container">
            <p><slot></slot></p>
        </section>
        <div :style="{ backgroundColor: `var(--${color}-color)` }" class="progress-bar"></div>
    </section>
</template>

<style scoped>
.notification-container {
    padding: 0.8em;
    border-radius: 15px;
    position: absolute;
    right: 2dvw;
    top: 2dvh;
    display: flex;
    flex-direction: column;
    background-color: var(--secondary-color);
    gap: 0.5em;
    animation: notification 3s forwards;
    border: 2px solid var(--danger-color);
    box-shadow: var(--box-shadow);
}

.progress-bar {
    height: 5px;
    border-radius: 15px;
    animation: progress 3s linear forwards;
}

@keyframes notification {
    0% {
        idisplay: flex;
        transform: translateX(100%);
    }
    20% {
        display: flex;
        transform: translateX(0);
    }
    80% {
        display: flex;
        transform: translateX(0);
    }
    100% {
        display: none;
        transform: translateX(100%);
    }
}

@keyframes progress {
    from { width: 100%; }
    to { width: 0; }
}
</style>