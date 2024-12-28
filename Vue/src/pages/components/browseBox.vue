<script setup>
import { ref, computed } from 'vue';
import { defineProps } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const props = defineProps({
    code: String,
    status: String
});

const tooltipVisible = ref(false);
const router = useRouter();

const showTooltip = () => {
    tooltipVisible.value = true;
};

const hideTooltip = () => {
    tooltipVisible.value = false;
};

const joinRoom = async (codes) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Authorization token is missing');
        return;
    }

    try {
        const response = await axios.post(`http://${window.location.hostname}:8000/api/room/${codes}/join`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
        console.log('Join room response:', response.data);  
        router.push(`/room/${codes}`);
    } catch (error) {
        console.error('Error joining room:', error);
    }
};

const statusClass = computed(() => {
    return {
        'status-waiting': props.status === 'waiting',
        'status-in-progress': props.status === 'in_progress',
        'status-full': props.status === 'full',
        'status-ended': props.status === 'ended'
    };
});

const isDisabled = computed(() => {
    return props.status === 'in_progress' || props.status === 'ended' || props.status === 'full';
});
</script>

// @todo anche se é disabled mi fa comunque la richiesta HTTTP all'api cosa che non deve brutto stronzo

<template>
    <li :class="['room-item', statusClass]" @click="joinRoom(code)" v-bind:disabled="isDisabled || null" @mouseover="showTooltip" @mouseleave="hideTooltip">
        <section class="room-header">
            <p class="room-code">CODE: {{ code }}</p>
            <div class="status-bookmark"> {{ status }}</div>
        </section>
        <span class="tooltip" v-if="tooltipVisible && !isDisabled">Click to Join Room</span>
    </li>
</template>

<style scoped>
img {
    width: 35px;
    height: auto;
}

li {
    padding: 15px;
    border: 0 solid;
    width: 60vw;
    font-size: 1.5rem;
    color: var(--secondary-color);
    background-color: var(--primary-color);
    cursor: pointer;
    box-shadow: 0 4px 4px rgb(0 0 0 / 25%);
    display: flex;
    align-items: center;
}

li:first-of-type {
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
}

li:last-of-type {
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
}

li:only-of-type {
    border-radius: 15px;
}

.room-item {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 15px;
    box-shadow: var(--box-shadow);
    transition: transform 0.2s, background-color 0.3s;
    cursor: pointer;
}

.room-item:hover {
    transform: scale(1.02);
}

.room-item[disabled] {
    cursor: not-allowed;
    opacity: 70%;
    transform: none;
}

.room-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

room-info {
    flex-grow: 1;
    position: relative;
}

.room-code {
    font-size: 1.2rem;
    color: var(--secondary-color);
}

.status-waiting {
    background-color: var(--success-color);
}

.status-full {
    background-color: var(--gold-color);
}

.status-in-progress {
    background-color: var(--danger-color);
}

.status-ended {
    background-color: var(--dark-color);
}

.tooltip {
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 1rem;
    white-space: nowrap;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.2s;
}

.room-item:hover .tooltip {
    opacity: 1;
}
</style>