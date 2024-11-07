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
        'authorization': localStorage.getItem('token')
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
  console.log('onMounted called');
  roomCode.value = route.params.roomCode;
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
});

onUnmounted(async () => {
  console.log('onUnmounted called');
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
