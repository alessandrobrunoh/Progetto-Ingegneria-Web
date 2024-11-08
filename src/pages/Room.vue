<script setup>
import { notification } from "@/assets/js/notificationEvent.js";
import TEAMBOX from "@/pages/components/TeamBox.vue";
import INVITECODE from "@/pages/components/InviteCode.vue";
import BUTTON from "@/pages/components/Button.vue";
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { io } from 'socket.io-client';
import axios from 'axios';

const router = useRoute();
const roomCode = ref('');
const players = ref([]);
const userId = ref(null);
const ready = ref(false);
const socket = io(`http://${window.location.hostname}:8000`); // Adjust the URL as needed

async function fetchUserId() {
  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/user`, {
      headers: {
        'authorization': localStorage.getItem('token')
      }
    });
    userId.value = response.data.id;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      if (error.response.data === 'Token expired') {
        alert('Session expired. Please log in again.');
        // Reindirizza l'utente alla pagina di login
        router.push('/sign-in');
      } else {
        alert('Access denied. Please log in.');
        router.push('/sign-in');
      }
    } else {
      console.error('Error fetching user data:', error);
    }
  }
}

async function fetchPlayers() {
  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${router.params.roomCode}/players`, {
      headers: {
        'authorization': localStorage.getItem('token')
      }
    });
    players.value = response.data.map(player => ({
      ...player,
      team: player.team,
      ready: player.ready
    }));
  } catch (error) {
    console.error('Error fetching players:', error);
  }
}

async function toggleReady() {
  try {
    const player = userId.value;
    if (!player) {
      // redirect to the home page
      //window.location.href = '/';
    }
    await axios.post(`http://${window.location.hostname}:8000/api/room/${roomCode.value}/player/${userId.value}/ready`, {
      ready: !player.ready
    }, {
      headers: {
        'authorization': localStorage.getItem('token') // Assuming the token is stored in localStorage
      }
    });
    socket.emit('updateReadyStatus', { userId: userId.value, ready: !player.ready });
  } catch (error) {
    console.error('Error updating ready status:', error);
  }
}

async function removePlayer(playerId) {
  try {
    await axios.post(`http://${window.location.hostname}:8000/api/room/${roomCode.value}/remove-player`, {
      playerId: playerId
    }, {
      headers: {
        'authorization': localStorage.getItem('token') // Assuming the token is stored in localStorage
      }
    });
    players.value = players.value.filter(player => player.user_id !== playerId);
  } catch (error) {
    console.error('Error removing player:', error);
  }
}

onMounted(async () => {
  roomCode.value = router.params.roomCode;
  await fetchUserId();
  await fetchPlayers();

  const player = { user_id: userId.value, name: 'PlayerName' };
  socket.emit('joinRoom', roomCode.value);
  socket.emit('playerJoined', roomCode.value, player);

  socket.on('playerJoined', (player) => {
    if (player && player.user_id) {
      players.value.push(player);
    }
  });

  socket.on('playerDisconnected', async (player) => {
    if (player && player.user_id) {
      players.value = players.value.filter(p => p.user_id !== player.user_id);
      await fetchPlayers(); // Refresh the player list
      console.log(`Player disconnected: ${player.name}`);
    }
  });
  socket.on('updateReadyStatus', ({ userId, ready }) => {
    const player = players.value.find(p => p.user_id === userId);
    if (player) {
      player.ready = ready;
    }
  });
});

onUnmounted(async () => {
  await fetchUserId();

  const player = { user_id: userId.value, name: 'PlayerName' };

  if (roomCode.value) {
    socket.emit('leaveRoom', roomCode.value, player);
    await removePlayer(userId.value);
  } else {
    console.error('Room code is not set');
  }

  socket.disconnect();
});
</script>

<template>
  <section class="room-container">
    <INVITECODE :placeholder="roomCode" />
    <section class="team-list-container">
      <h2>Squadra 1</h2>
      <section class="team-container">
        <TEAMBOX v-for="(player, index) in players.filter(p => p?.team === 1)" :key="index"
          :color="player?.ready ? 'success' : 'danger'" :host="index === 0">{{ player?.name }}</TEAMBOX>
      </section>
      <i class="cm-switch"></i>
      <section class="team-container">
        <h2>Squadra 2</h2>
        <TEAMBOX v-for="(player, index) in players.filter(p => p?.team === 2)" :key="index"
          :color="player?.ready ? 'success' : 'danger'">{{ player?.name }}</TEAMBOX>
      </section>
    </section>
    <footer>
      <BUTTON :color="players.find(p => p?.user_id === userId.value)?.ready ? 'success' : 'danger'"
        @click="toggleReady">READY</BUTTON>
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
