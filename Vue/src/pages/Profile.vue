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
const showGameHistory = ref(true);
const rooms = ref([]);
const token = getToken();

const logout = () => {
  notification.send("Logout successful", "success");
  localStorage.removeItem('token');
  router.push('/');
}

const getUserID = async () => {
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
  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/user/${player_id.value}`, {
      headers: {
        'authorization': `Bearer ${token}`,
      },
    });
    avatar.value = response.data.avatar;
    game_win.value = response.data.wins;
    game_lost.value = response.data.total_games - response.data.wins;
    best_points.value = response.data.best_points;
    apiLoaded.value = true;
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

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

// Funzione per ottenere tutte le stanze e i giocatori
const getRoomsPlayers = async (code) => {
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

const toggleSection = () => {
  showGameHistory.value = !showGameHistory.value;
};

onBeforeMount(async () => {
  player_id.value = await getUserID();
  await getUser();
  rooms.value = await getRooms();
  console.log(rooms); 
});
</script>

<template>
  <section v-if="apiLoaded" class="profile-container">
    <!-- <i class="fe-log-out logout-icon" @click="logout"></i> -->
    <img :src="`../assets/img/avatars/${avatar}.svg`" alt="Profile Avatar" />
    <button @click="toggleSection" class="toggle-button">
      Switch Section
    </button>
    <div class="content-container" >
      <section v-if="showGameHistory" class="gamehistory-container">
        <div class="game-box" v-for="room in rooms" action="leaderboard" code="">
          <p>{{ room.code  }}</p>
        </div>
      </section>
      <section v-else class="statistics-container">
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
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  color: var(--secondary-color);
  background-color: var(--danger-color);
  border-radius: 10px;

  .won {
    background-color: var(--success-color);
  }

  .lost {
    background-color: var(--danger-color);
  }
} 

img {
  width: 8rem;
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

.toggle-button {
  cursor: pointer;
  padding: 10px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 5px;
  margin-bottom: 20px;
}

.statistics-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    "item1 item2"
    "item3 item3";
  gap: 10px;
  align-items: center;
  justify-items: center;
}

.gamehistory-container {
  overflow-y: scroll;
  height: 25vh;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 80vw;
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
</style>