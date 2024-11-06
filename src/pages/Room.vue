<script setup>
import TEAMBOX from "@/pages/components/TeamBox.vue";
import INVITECODE from "@/pages/components/InviteCode.vue";
import BUTTON from "@/pages/components/Button.vue";
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { io } from 'socket.io-client';
import axios from 'axios';

const route = useRoute();
const roomCode = ref('');
const players = ref([]);
const userId = ref(null);
const socket = io(`http://${window.location.hostname}:8000`); // Adjust the URL as needed

async function fetchUserId() {
  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/user`, {
      headers: {
        'Authorization': localStorage.getItem('token') // Assuming the token is stored in localStorage
      }
    });
    userId.value = response.data.id;
  } catch (error) {
    console.error('Error fetching user ID:', error);
  }
}

async function fetchPlayers() {
  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${route.params.roomCode}/players`, {
      headers: {
        'Authorization': localStorage.getItem('token') // Assuming the token is stored in localStorage
      }
    });
    players.value = response.data.map(player => ({
      ...player,
      ready: false // Initialize ready status
    }));
  } catch (error) {
    console.error('Error fetching players:', error);
  }
}

async function toggleReady() {
  try {
    const player = players.value.find(p => p.user_id === userId.value);
    if (player) {
      player.ready = !player.ready;
      await axios.post(`http://${window.location.hostname}:8000/api/room/${roomCode.value}/player/${userId.value}/ready`, {
        ready: player.ready
      }, {
        headers: {
          'Authorization': localStorage.getItem('token') // Assuming the token is stored in localStorage
        }
      });
    }
  } catch (error) {
    console.error('Error updating ready status:', error);
  }
}

function removePlayer(playerId) {
  players.value = players.value.filter(player => player.user_id !== playerId);
}

onMounted(async () => {
  roomCode.value = route.params.roomCode;
  await fetchUserId();
  fetchPlayers();

  const player = { user_id: userId.value, name: 'PlayerName' }; // Define the player object
  socket.emit('joinRoom', roomCode.value);
  socket.emit('playerJoined', roomCode.value, player); // Pass the player object

  socket.on('playerJoined', (player) => {
    player.ready = false; // Initialize ready status
    players.value.push(player);
  });
});

onUnmounted(() => {
  socket.disconnect(); // Disconnect the socket when the component is unmounted
});
</script>

<template>
  <section class="room-container">
    <INVITECODE :placeholder="roomCode"/>
    <section class="team-list-container">
      <h2>Squadra 1</h2>
      <section class="team-container">
        <TEAMBOX v-for="(player, index) in players.filter(p => p.team === 1)" :key="index" :color="player.ready ? 'success' : 'danger'" :host="index === 0">{{ player.name }}</TEAMBOX>
      </section>
      <i class="cm-switch"></i>
      <section class="team-container">
        <h2>Squadra 2</h2>
        <TEAMBOX v-for="(player, index) in players.filter(p => p.team === 2)" :key="index" :color="player.ready ? 'success' : 'danger'">{{ player.name }}</TEAMBOX>
      </section>
    </section>
    <footer>
      <BUTTON :color="players.find(p => p.user_id === userId)?.ready ? 'success' : 'danger'" @click="toggleReady">READY</BUTTON>
    </footer>
  </section>
</template>

<style scoped>
h2 {
  color: var(--primary-color);
  margin-bottom: 1vh;
}

.room-container {
  display: flex;
  width: 80vw;
  flex-direction: column;
  height: 68vh;
  justify-content: space-between;
}

section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.team-list-container {
  padding: 2vh 0;
}

.team-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.cm-switch {
  display: flex;
  margin-left: auto;
  margin-top: 3vh;
}
</style>