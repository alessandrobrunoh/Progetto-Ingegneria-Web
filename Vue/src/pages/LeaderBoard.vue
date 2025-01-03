<script setup>
import { notification } from "@/assets/js/notificationEvent.js";
import PODIUM from "@/pages/components/Podium.vue";
import BUTTON from "@/pages/components/Button.vue";
import { useRoute, useRouter } from 'vue-router';
import { getToken } from '../assets/js/getToken';
import { onMounted, ref, computed, onBeforeMount } from "vue";
import { playSound } from "../assets/js/playSound";
import axios from 'axios';
import Cookies from 'js-cookie';
import { generatePhrase } from '../assets/js/generatePhrase';

const token = getToken();
const leaderboard = ref([]);
const PodiumLoaded = ref(false);
const route = useRoute();
const router = useRouter();
const player_id = ref(null);
const cookies = Cookies.get("music");
if (!cookies) {
  Cookies.set("music", true);
}

const getRoom = async () => {
  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${route.params.code}`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching room code:', error);
  }
};

const getLeaderboard = async () => {
  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${route.params.code}/leaderboard`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
  }
};

const getCurrentUserPoints = () => {
  const player = leaderboard.value.find(podium => podium.players.includes(player_id.value));
  return player ? player.points : 0;
};

const getUserID = async () => {
  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/user`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user ID:', error);
  }
};

const getUsername = async (players) => {
  const usernames = {};
  for (const player of players) {
    try {
      const response = await axios.get(`http://${window.location.hostname}:8000/api/user/${player}`, {
        headers: {
          'authorization': `Bearer ${token}`
        }
      });
      const username = response.data.username;
      usernames[player] = username.charAt(0).toUpperCase() + username.slice(1);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }
  return usernames;
};

const getTeamName = (team, usernames) => {
  if (team.length === 1) return usernames[team[0]];
  return team.length === 2 ? "Squadra 1" : "Squadra 2";
};

const highestPoints = computed(() => {
  if (leaderboard.value.length === 0) return null;
  let maxPoints = -Infinity;
  for (const podium of leaderboard.value) {
    if (podium.points > maxPoints) {
      maxPoints = podium.points;
    }
  }
  if(getCurrentUserPoints() === maxPoints) {
    playSound("victory");
  } else {
    playSound("defeat");
  }
  return maxPoints;
});

onBeforeMount(async () => {
  player_id.value = await getUserID();
  const room = await getRoom();
  if (room.status != 'ended') {
    notification.send("This game is still in progress, you can't access the leaderboard yet", "danger");
    router.push('/');
    playSound("wrong");
  }
  if(room.length === 0) {
    notification.send("This room doesn't exist", "danger");
    router.push('/');
    playSound("wrong");
  }
  leaderboard.value = await getLeaderboard();
  const allPlayers = leaderboard.value.flatMap(podium => podium.players);
  const usernames = await getUsername(allPlayers);
  for (const podium of leaderboard.value) {
    podium.teamName = getTeamName(podium.players, usernames);
  }
});
</script>

<template>
  <section class="container">
    <h1>{{ generatePhrase(getCurrentUserPoints()) }}</h1>
    <section class="leaderboard-container">
      <PODIUM v-for="(podium, index) in leaderboard" :key="index" :winner="podium.points === highestPoints"
        :team="podium.teamName" :points="podium.points" />
    </section>
    <footer>
      <router-link to="/">
        <BUTTON color="primary">GO HOME</BUTTON>
      </router-link>
    </footer>
  </section>
</template>

<style scoped>
.leaderboard-container {
  display: flex;
  gap: 40px;
}

h1 {
  margin-top: 5vh;
  color: var(--primary-color);
  font-size: 1.3rem;
  text-align: center;
}

.container {
  display: flex;
  width: 80vw;
  flex-direction: column;
  align-items: center;
  height: 70dvh;
  gap: 5vh;
  justify-content: space-between;
}
</style>