<script setup>
import { onBeforeMount, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getToken } from '../../assets/js/getToken.js';
import BUTTON from './Button.vue';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const token = getToken();
const code = ref(route.params.code);

const briscola = ref([]);
const cardTheme = ref('Old Style');
const avatar = ref(1);

const getUserID = async () => {
    try {
        const response = await axios.get(`http://${window.location.hostname}:8000/api/user`, {
            headers: {
                'authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching get user id:', error);
    }
};

const getCardTheme = async () => {
    try {
        const response = await axios.get(`http://${window.location.hostname}:8000/api/user/${await getUserID()}`, {
            headers: {
                'authorization': `Bearer ${token}`
            }
        });
        return response.data.cards;
    } catch (error) {
        console.error('Error fetching get user id:', error);
    }
};

const getBriscola = async () => {
    try {
        const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${route.params.code}/briscola`, {
            headers: {
                'authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching briscola:', error);
    }
};

const getAvatar = async () => {
    try {
        const response = await axios.get(`http://${window.location.hostname}:8000/api/user/${await getUserID()}`, {
            headers: {
                'authorization': `Bearer ${token}`
            }
        });
        return response.data.avatar;
    } catch (error) {
        console.error('Error fetching get user id:', error);
    }
};

const giveUp = async () => {
    try {
        await axios.post(`http://${window.location.hostname}:8000/api/room/${route.params.code}/player/give_up`, {}, {
            headers: {
                'authorization': `Bearer ${token}`
            }
        });
        router.push(`/leaderboard/${route.params.code}`);
    } catch (error) {
        console.error('Error fetching give up:', error);
    }
};

onBeforeMount(async () => {
    cardTheme.value = await getCardTheme();
    briscola.value = await getBriscola();
    avatar.value = await getAvatar();
});

</script>

<template>
    <section class="header-game-container">
        <img class="briscola" :src="`../assets/img/cards/${cardTheme}/${briscola.number}_${briscola.seed}.png`"
            :alt="`Briscola ${briscola.number} ${briscola.seed}`" />
        <BUTTON @click="giveUp" color="danger">GIVE UP</BUTTON>
        <img alt="Avatar Profile" :src="`../assets/img/avatars/${avatar}.svg`" />
    </section>
</template>

<style scooped lang="scss">
.header-game-container {
    display: flex;
    gap: 1em;
    align-items: center;
    justify-content: space-between;
    padding: 2vh 5vw 0 5vw;
    z-index: 100;
}

img {
    width: 3.5em;
    height: auto;

    &.briscola {
        width: 3em;
        padding: 3px;
        border-radius: 10px;
        background-color: var(--white-color);
        border: 3px solid var(--primary-color);
    }
}
</style>