<script setup>
import { notification } from "@/assets/js/notificationEvent.js";
import STATSBOX from "@/pages/components/statsBox.vue";
import BUTTON from "@/pages/components/Button.vue";
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const router = useRouter();
const avatar = ref("");
const player_id = ref(null);
const game_win = ref(0);
const game_lost = ref(0);
const best_points = ref(0);
const apiLoaded = ref(false);

const logout = () => {
  notification.send("Logout successful", "success");
  localStorage.removeItem('token');
  router.push('/');
}

const getUserID = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Authorization token is missing");
    return;
  }

  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/user`, {
      headers: {
        'authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user ID:", error);
  }
}

const getUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Authorization token is missing");
    return;
  }

  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/user/${player_id.value}`, {
      headers: {
        'authorization': `Bearer ${token}`,
      },
    });
    avatar.value = response.data.avatar;
    game_win.value = response.data.games_win;
    game_lost.value = response.data.total_games - response.data.games_win;
    best_points.value = response.data.best_points;
    apiLoaded.value = true;
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

onMounted(async () => {
  player_id.value = await getUserID();
  await getUser();
});
</script>

<template>
  <section v-if="apiLoaded" class="profile-container">
    <!-- <i class="fe-log-out logout-icon" @click="logout"></i> -->
    <img :src="`../assets/img/avatars/${avatar}.svg`" alt="Profile Avatar" />
    <section class="statistics-container">
      <STATSBOX type="wins" :number="game_win">Games Wins</STATSBOX>
      <STATSBOX type="loses" :number="game_lost">Games Loses</STATSBOX>
      <STATSBOX type="best" :number="best_points">Best Points</STATSBOX>
    </section>
  </section>
  <footer>
    <router-link to="/profile/settings"><BUTTON color="primary">SETTINGS</BUTTON></router-link>
    <router-link to="/"><BUTTON color="danger" @click="logout">LOGOUT</BUTTON></router-link>
  </footer>
</template>

<style scoped>
a {
  text-decoration: none;
  color: var(--secondary-color);
}

.logout-icon {
  position: absolute;
  top: 10px;
  left: 10px;
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--primary-color);
}

img {
  width: 15rem;
  height: auto;
}

.profile-container {
  display: flex;
  width: 80vw;
  flex-direction: column;
  align-items: center;
  height: 50vh;
  gap: 5vh;
  justify-content: space-between;
  position: relative;
}

.statistics-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto;
  gap: 10px;
}

.statistics-container STATSBOX:nth-child(3) {
  grid-column: span 2;
  justify-self: center;
  align-self: center;
}
</style>