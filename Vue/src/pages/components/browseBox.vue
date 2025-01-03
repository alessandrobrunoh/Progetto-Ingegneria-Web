<script setup>
import { onBeforeMount, ref } from 'vue';
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

const players = ref([]);
const token = getToken();
const router = useRouter();
const tooltipVisible = ref(false);
const player_name = ref('');
const player_elo = ref(0);

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

const getRoomPlayers = async (code) => {
    try {
        const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${code}/players`, {
            headers: {
                'authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching room code:', error);
    }
};

const getUser = async (player_id) => {
    try {
        const response = await axios.get(`http://${window.location.hostname}:8000/api/user/${player_id}`, {
            headers: {
                'authorization' : `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
    }
};

onBeforeMount(async () => {
    players.value = await getRoomPlayers(props.code);
    const player = await getUser(players.value[0].user_id);
    player_name.value = player.username.charAt(0).toUpperCase() + player.username.slice(1);
    player_elo.value = player.elo;
});
</script>

<template>
    <fieldset class="browse-box" @click="joinRoom(code)" @mouseover="tooltipVisible = true"
        @mouseleave="tooltipVisible = false">
            <legend>{{ code }}</legend>
            <h1>Vs</h1>
            <p>{{ player_name }} (Elo: {{ player_elo }})</p>
            <span class="tooltip" v-if="tooltipVisible">Click to Join Room</span>
    </fieldset>
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
    box-shadow: var(--box-shadow);
    border: 2px solid transparent;
}

legend {
    top: 10px;
    padding: 5px 25px;
    background-color: var(--gold-color);
    border-radius: 10px;
    position: relative;
    font-size: 1.3rem;
    border: 3px solid var(--secondary-color);
    text-align: center;
 
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