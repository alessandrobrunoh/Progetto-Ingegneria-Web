<script setup>
import { ref } from 'vue';
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { getToken } from '../../assets/js/getToken';

const props = defineProps({
    code: {
        type: String,
        required: true
    },
});

const token = getToken();
const router = useRouter();
const tooltipVisible = ref(false);

const joinRoom = async (code) => {
    try {
        const response = await axios.post(`http://${window.location.hostname}:8000/api/room/${code}/join`, {}, {
            headers: {
                'authorization': `Bearer ${token}`
            }
        });
        return router.push(`/room/${code}`);
    } catch (error) {
        console.error('Error joining room:', error);
    }
};
</script>

<template>
    <section class="browse-box" @click="joinRoom(code)" @mouseover="tooltipVisible = true"
        @mouseleave="tooltipVisible = false">
        <h3>Code: {{ code }}</h3>
        <span class="tooltip" v-if="tooltipVisible">Click to Join Room</span>
    </section>
</template>

<style scoped>
.browse-box {
    padding: 2vh 5vw;
    background-color: var(--link-color);
    border-radius: 15px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
    color: var(--secondary-color);
}

.browse-box:hover {
    transform: scale(1.05);
    transition: transform 0.3s;
    cursor: pointer;
}

.tooltip {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: black;
    color: white;
    padding: 5px;
    border-radius: 3px;
    white-space: nowrap;
    z-index: 10;
}

.tooltip::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-bottom-color: black;
}
</style>