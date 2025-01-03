<script setup>
import { ref, onBeforeMount, onBeforeUpdate, onUpdated } from 'vue';
import HEADER from '@/pages/components/Header.vue';
import HEADER_GAME from '@/pages/components/HeaderGame.vue';
import NOTIFICATION from '@/pages/components/Notification.vue';
import { notification } from './assets/js/notificationEvent.js';
import { getToken } from './assets/js/getToken.js';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const token = ref(getToken());
const showNotification = notification.showNotification;
const notificationMessage = notification.notificationMessage;
const notificationColor = notification.notificationColor;
const theme = ref('Old Style');
const loadHeader = ref(false);
const loadHeaderGame = ref(false);

const isGameRoute = () => {
  const gameRoutePattern = /^\/game\/[^/]+$/;
  return gameRoutePattern.test(route.path) || window.location.pathname.includes('/game/');
};

const getUserID = async () => {
  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/user`, {
      headers: {
        'authorization': `Bearer ${token.value}`
      }
    });
    if (response.data === "Logged out Successfully") {
      localStorage.removeItem('token');
      router.push('/');
      return;
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching get user id:', error);
  }
};

const getTheme = async () => {
  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/user/${await getUserID()}`, {
      headers: {
        'authorization': `Bearer ${token.value}`
      }
    });
    return response.data.theme;
  } catch (error) {
    console.error('Error fetching get user id:', error);
  }
};

const isInGame = async () => {
  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/player/in_game`, {
      headers: {
        'authorization': `Bearer ${token.value}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching get isInGame:', error);
  }
};

onBeforeMount(async () => {
  await isInGame();
  theme.value = await getTheme();
  document.body.setAttribute('theme', theme.value);
  loadHeader.value = false;
  loadHeaderGame.value = false;
  if (token.value != undefined) {
    if (isGameRoute()) {
      console.log('isGameRoute');
      loadHeaderGame.value = true;
    } else {
      loadHeader.value = true;
    }
  }
});

router.beforeEach(async (to, from, next) => {
  token.value = getToken();
  if (to.path.includes('/game/')) {
    loadHeader.value = false;
    loadHeaderGame.value = true;
  } else {
    loadHeader.value = true;
    loadHeaderGame.value = false;
  }
  theme.value = await getTheme();
  document.body.setAttribute('theme', theme.value);
  next();
});
</script>

<template>
  <NOTIFICATION v-if="showNotification" :color="notificationColor">
    {{ notificationMessage }}
  </NOTIFICATION>
  <HEADER v-if="loadHeader"></HEADER>
  <HEADER_GAME v-if="loadHeaderGame"></HEADER_GAME>
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
</style>