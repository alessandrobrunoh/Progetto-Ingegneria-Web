<script setup>
import { ref, onMounted, onUpdated } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import BUTTON from '@/pages/components/Button.vue';
import NOTIFICATION from '@/pages/components/Notification.vue';
import { notification } from './assets/js/notificationEvent.js';
import Cookies from 'js-cookie';
import { playSound } from './assets/js/playSound.js';

const isAuthenticated = ref(false);
const route = useRoute();
const router = useRouter();
const showNotification = notification.showNotification;
const notificationMessage = notification.notificationMessage;
const notificationColor = notification.notificationColor;
const player_id = ref(null);
const theme = ref('Old Style');
const music = ref(true);
const avatar = ref(0);
const briscola = ref(null);
const imageLoaded = ref(false);

const cookies = Cookies.get('music');
if (!cookies) {
  Cookies.set('music', true);
}

const checkAuth = async () => {
  const token = localStorage.getItem('token');
  isAuthenticated.value = !!token;
  if (!isAuthenticated.value) {
    return router.push('/sign-in');
  }
};

const getLastCard = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Authorization token is missing');
    return;
  }

  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${route.params.code}/last_card`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    return response.data.seed;
  } catch (error) {
    console.error('Error fetching last card:', error);
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
        'authorization': `Bearer ${token}`
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
        'authorization': `Bearer ${token}`
      }
    });
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
        'authorization': `Bearer ${token}`
      }
    });
    if (response.data == "Logged out successfully") {
      notification.send("Session expired, please log in again", "danger");
      localStorage.removeItem('token');
      return router.push("/");
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching user ID:', error);
    return null;
  }
};

const getUser = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/user/${player_id.value}`, {
      headers: {
        'authorization': `Bearer ${token}`
      },
    });
    avatar.value = response.data.avatar;
    imageLoaded.value = true;
    music.value = response.data.music;
    if (music.value == 1) {
      music.value = true;
    } else {
      music.value = false;
    }
    Cookies.set('music', music.value);
    document.body.setAttribute('theme', response.data.theme);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

const RedirectProfile = () => {
  if (cookies === "true") {
    playSound('btn_click');
  }
  router.push('/profile');
};

onMounted(async () => {
  player_id.value = await getUserID();
  await checkAuth();
  getUser();
  briscola.value = await getLastCard();
});

onUpdated(async () => {
  await checkAuth();
  //await isInGame();
});
</script>

<template>
  <NOTIFICATION v-if="showNotification" :color="notificationColor">
    {{ notificationMessage }}
  </NOTIFICATION>
  <section v-if="isAuthenticated" class="profile-icon-container">
    <router-link to="/" v-if="!isGameRoute()"><img
        src="https://x.boardgamearena.net/data/gamemedia/briscola/box/en_280.png?h=1693578389"
        alt="Vue logo" /></router-link>
    <!-- <img v-if="isGameRoute()" class="briscola" -->
    <!-- src="https://x.boardgamearena.net/data/gamemedia/briscola/box/en_280.png?h=1693578389" /> -->
    <span v-if="isGameRoute()">Briscola: {{ briscola }}</span>
    <BUTTON v-if="isGameRoute()" @click="giveUp" color="danger">GIVE UP</BUTTON>
    <img @click="RedirectProfile" v-if="imageLoaded" alt="Avatar Profile"
      :src="`../assets/img/avatars/${avatar}.svg`" />
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

img.briscola {
  cursor: default !important;
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