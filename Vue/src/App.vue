<script setup>
import { ref, onMounted, onUpdated } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import BUTTON from '@/pages/components/Button.vue';
import NOTIFICATION from '@/pages/components/Notification.vue';
import { notification } from './assets/js/notificationEvent.js';

const isAuthenticated = ref(false);
const route = useRoute();
const router = useRouter();
const showNotification = notification.showNotification;
const notificationMessage = notification.notificationMessage;
const notificationColor = notification.notificationColor;
const player_id = ref(null);
const theme = ref('light');

const checkAuth = async () => {
  const token = localStorage.getItem('token');
  isAuthenticated.value = !!token;
  if (!isAuthenticated.value) {
    router.push('/sign-in');
    return;
  }
};

const isInGame = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Authorization token is missing');
    return;
  }

  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/player/in_game`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.length > 0 && !isGameRoute()) {
      notification.send('You are in a game', 'danger');
      router.push(`/game/${response.data[0].room_code}`);
    }
    return;
  } catch (error) {
    console.error('Error fetching room code:', error);
  }
};

const isGameRoute = () => {
  const gameRoutePattern = /^\/game\/[^/]+$/;
  return gameRoutePattern.test(route.path);
};

const giveUp = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Authorization token is missing');
    return;
  }

  try {
    const response = await axios.post(`http://${window.location.hostname}:8000/api/player/give_up`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Give up response:', response.data);
    notification.send('You gave up', 'danger');
    router.push('/');
    return response.data;
  } catch (error) {
    console.error('Error giving up:', error);
  }
  notification.send('You gave up', 'danger');
  router.push('/');
};

const getUserID = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Authorization token is missing');
    return null;
  }

  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user ID:', error);
    return null;
  }
};

const getTheme = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Authorization token is missing');
    return;
  }

  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/user/${player_id.value}/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    document.body.setAttribute('theme', response.data.theme);
  } catch (error) {
    console.error('Error fetching theme:', error);
  }
};

onMounted(async () => {
  await checkAuth();
  player_id.value = await getUserID();
  await getTheme();
});

onUpdated(async () => {
  await checkAuth();
  await isInGame();
});
</script>

<template>
  <NOTIFICATION v-if="showNotification" :color="notificationColor">
    {{ notificationMessage }}
  </NOTIFICATION>
  <section v-if="isAuthenticated" class="profile-icon-container">
    <router-link to="/"><img src="https://x.boardgamearena.net/data/gamemedia/briscola/box/en_280.png?h=1693578389"
        alt="Vue logo" /></router-link>
    <BUTTON v-if="isGameRoute()" @click="giveUp" color="danger">GIVE UP</BUTTON>
    <router-link to="/profile">
      <img alt="Avatar Profile" src="@/assets/img/avatars/Avatar-0.svg" />
    </router-link>
  </section>
  <main :theme="theme">
    <router-view></router-view>
  </main>
</template>

<style scoped>
@import url('assets/css/style.scss');

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.profile-icon-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2vh 5vw 0 5vw;
}

img {
  width: 50px;
  height: auto;
  cursor: pointer;
  border-radius: 50%;
}

img:active {
  transform: scale(0.9);
}

button {
  font-size: 1.1rem;
  width: 50%;
  padding: 10px;
  border-radius: 10px !important;
}
</style>