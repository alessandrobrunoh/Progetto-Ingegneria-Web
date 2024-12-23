<script setup>
import { ref, onMounted, onUpdated } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import BUTTON from '@/pages/components/Button.vue';
import NOTIFICATION from '@/pages/components/Notification.vue';
import { notification } from './assets/js/notificationEvent.js';

const isAuthenticated = ref(false);
const route = useRoute();
const router = useRouter();
const showNotification = notification.showNotification;
const notificationMessage = notification.notificationMessage;
const notificationColor = notification.notificationColor;

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

onUpdated(() => {
  checkAuth();
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