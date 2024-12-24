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
const inGame = ref(false);

const checkAuth = () => {
  const token = localStorage.getItem('token');
  isAuthenticated.value = !!token;
  if (!isAuthenticated.value) {
    router.push('/sign-in');
  }
};

const isGameRoute = () => {
  const gameRoutePattern = /^\/game\/[^/]+$/;
  return gameRoutePattern.test(route.path);
};

const giveUp = () => {
  notification.send('You gave up', 'danger');
  router.push('/');
};

const isUserInGame = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return;
  }

  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/player/in_game`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if(!response.data.room_code) {
      return;
    }
    if (response.data.room_code.length > 0) {
      router.push(`/game/${response.data.room_code}`);
      return;
    }
  } catch (error) {
    console.error('Error fetching players:', error);
  }
};

onUpdated(async () => {
  checkAuth();
  await isUserInGame();
});

onMounted(() => {
  checkAuth();
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
  <main>
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