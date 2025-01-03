<script setup>
import { notification } from "@/assets/js/notificationEvent.js";
import STATSBOX from "@/pages/components/statsBox.vue";
import BUTTON from "@/pages/components/Button.vue";
import BROWSEBOX from "@/pages/components/browseBox.vue";
import { useRouter } from 'vue-router';
import { ref, onMounted, onBeforeMount } from 'vue';
import axios from 'axios';
import { getToken } from "../assets/js/getToken";

const router = useRouter();
const avatar = ref("");
const player_id = ref(null);
const game_win = ref(0);
const game_lost = ref(0);
const best_points = ref(0);
const apiLoaded = ref(false);
const showGameHistory = ref(false);
const elo = ref(0);
const rooms = ref([]);
const historyRooms = ref([]);
const token = getToken();

const logout = () => {
  notification.send("Logout successful", "success");
  localStorage.removeItem('token');
  router.push('/');
}

const getUser = async (player_id) => {
  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/user/${player_id}`, {
      headers: {
        'authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};

const getUserID = async () => {
  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/user`, {
      headers: {
        'authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user ID:', error);
  }
};

const getRooms = async () => {
  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/browse`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    notification.send("Error fetching rooms", "danger");
    return [];
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
    console.error('Error fetching rooms:', error);
    return [];
  }
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getGameHistory = async () => {
  for (let room of rooms.value) {
    const players = await getRoomPlayers(room.code);
    for (let player of players) {
      if (player.user_id === player_id.value && room.status === 'ended') {
        const opponent = players.find(p => p.user_id !== player_id.value);
        const playerName = await getUser(player_id.value);
        if (opponent) {
          const opponentName = await getUser(opponent.user_id);
          historyRooms.value.push({
            code: room.code,
            playerName: capitalizeFirstLetter(playerName.username),
            playerPoints: player.points || 0,
            playerElo: player.elo || 0,
            opponentPoints: opponent.points || 0,
            opponentName: capitalizeFirstLetter(opponentName.username),
            opponentElo: opponent.elo || 0,
          });
        }
      }
    }
  }
};

const toggleSection = () => {
  showGameHistory.value = !showGameHistory.value;
};

const getBoxClass = (playerPoints, opponentPoints) => {
  return playerPoints > opponentPoints ? 'box-green' : 'box-red';
};

const goToLeaderboard = (code) => {
  router.push(`/leaderboard/${code}`);
};

onBeforeMount(async () => {
  player_id.value = await getUserID();
  const user = await getUser(player_id.value);
  game_win.value = user.wins;
  game_lost.value = user.total_games - user.wins;
  best_points.value = user.best_points;
  elo.value = user.elo;
  avatar.value = user.avatar;
  rooms.value = await getRooms();
  await getGameHistory();
});
</script>

<template>
  <section class="profile-container">
    <img :src="`../assets/img/avatars/${avatar}.svg`" alt="Profile Avatar" />
    <span @click="toggleSection" class="toggle-button"><i class="fe-change"></i> {{ showGameHistory ? 'Switch to Statistics' : 'Switch to GameHistory' }}</span>
    <div class="content-container">
      <section v-if="showGameHistory">
        <div v-if="historyRooms.length === 0">
          <p>No games played yet</p>
        </div>
        <div v-else class="gamehistory-container">
          <div class="game-box" v-for="room in historyRooms" :key="room.code"
            :class="getBoxClass(room.playerPoints, room.opponentPoints)" @click="goToLeaderboard(room.code)">
            <div class="game-info">
              <p>{{ room.playerName }} (Elo: {{ room.playerElo }})</p>
              <div class="points-container">
                <p>{{ room.playerPoints }}</p>
                <h1>Vs</h1>
                <p>{{ room.opponentPoints }}</p>
              </div>
              <p> {{ room.opponentName }} (Elo: {{ room.opponentElo }})</p>
            </div>
          </div>
        </div>
      </section>
      <section v-else class="statistics-container">
        <STATSBOX class="item4" type="elo" :number="elo">Elo</STATSBOX>
        <STATSBOX class="item1" type="wins" :number="game_win">Games Won</STATSBOX>
        <STATSBOX class="item2" type="loses" :number="game_lost">Games Lost</STATSBOX>
        <STATSBOX class="item3" type="best" :number="best_points">Best Points</STATSBOX>
      </section>
    </div>
  </section>
  <footer>
    <router-link to="/profile/settings"><BUTTON color="primary">SETTINGS</BUTTON></router-link>
    <router-link to="/"><BUTTON color="danger" @click="logout">LOGOUT</BUTTON></router-link>
  </footer>
</template>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: var(--secondary-color);
}

h1 {
  font-size: 1.5rem;
}

.logout-icon {
  position: absolute;
  top: 10px;
  left: 10px;
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--primary-color);
}

.game-box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  border-radius: 15px;
  color: var(--secondary-color);
  cursor: pointer;
}

.game-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.game-box:hover {
  transform: scale(1.05);
  transition: transform 0.3s;
}

.box-green {
  background-color: var(--success-color);
}

.box-red {
  background-color: var(--danger-color);
}

img {
  width: 6.6rem;
  height: auto;
}

.points-container {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.profile-container {
  display: flex;
  width: 90vw;
  flex-direction: column;
  align-items: center;
  height: 50vh;
  gap: 5px;
  justify-content: space-between;
  position: relative;
}

.toggle-button {
  cursor: pointer;
  padding: 10px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
}

.statistics-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    "item4 item4"
    "item1 item2"
    "item3 item3";
  gap: 10px;
  align-items: center;
  justify-items: center;
}

.gamehistory-container {
  overflow-y: scroll;
  height: 25vh;
  width: 90vw;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.item1 {
  grid-area: item1;
}

.item2 {
  grid-area: item2;
}

.item3 {
  grid-area: item3;
}

.item4 {
  grid-area: item4;
}
</style>