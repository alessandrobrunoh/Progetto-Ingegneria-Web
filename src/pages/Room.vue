<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { io } from 'socket.io-client';
import axios from 'axios';
import INVITECODE from './components/InviteCode.vue';
import TEAMBOX from './components/TeamBox.vue';
import BUTTON from './components/Button.vue';
import { notification } from '../assets/js/notificationEvent';

const route = useRoute();
const roomCode = ref('');
const players = ref([]);
const userId = ref(null);
const isHost = ref(false);
const socket = io(`http://${window.location.hostname}:8000`); 
const isGameStarted = ref(false);

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
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${roomCode.value}/players`, {
      headers: {
        'authorization': localStorage.getItem('token')
      }
    });
    players.value = response.data;
    const currentPlayer = players.value.find(p => p.USER_id === userId.value);
    if (currentPlayer) {
      isHost.value = currentPlayer.host;
    }
  } catch (error) {
    console.error('Error fetching players:', error);
  }
}

async function removePlayer(playerId) {
  try {
    await axios.post(`http://${window.location.hostname}:8000/api/room/${roomCode.value}/remove-player`, {
      playerId
    }, {
      headers: {
        'authorization': localStorage.getItem('token')
      }
    });
    players.value = players.value.filter(p => p.USER_id !== playerId);
    if (players.value.length === 0) {
      await deleteRoom();
    }
  } catch (error) {
    console.error('Error removing player:', error);
  }
}

async function deleteRoom() {
  try {
    await axios.delete(`http://${window.location.hostname}:8000/api/room/${roomCode.value}/delete`, {
      headers: {
        'authorization': localStorage.getItem('token')
      }
    });
    console.log('This Room has been deleted');
  } catch (error) {
    console.error('Error deleting room:', error);
  }
}

async function startGame() {
  try {
    await axios.post(`http://${window.location.hostname}:8000/api/room/${roomCode.value}/start-game`, {
      roomCode: roomCode.value
    }, {
      headers: {
        'authorization': localStorage.getItem('token')
      }
    });
    notification.send('Game started successfully', 'success',);
    // send to /game
    window.location.href = `/game/${roomCode.value}`;
  } catch (error) {
    console.error('Error starting game:', error);
  }
}


async function checkGameStarted() {
  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${roomCode.value}`, {
      headers: {
        'authorization': localStorage.getItem('token')
      }
    });
    isGameStarted.value = response.data.gameStarted;
  } catch (error) {
    console.error('Error checking game status:', error);
  }
}

onMounted(async () => {
  roomCode.value = route.params.roomCode;
  await fetchUserId();
  await fetchPlayers();
  await checkGameStarted();

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
      if (players.value.length === 0) {
        await deleteRoom();
      }
    }
  });
});

onUnmounted(async () => {
  const player = { user_id: userId.value };

  if (roomCode.value) {
    socket.emit('leaveRoom', roomCode.value, player);
    await checkGameStarted();
    if (!isGameStarted.value) {
      await removePlayer(userId.value);
    }
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
      <section v-if="players.filter(p => p?.team === 1).length > 0">
        <h2>Squadra 1</h2>
        <section class="team-container">
          <TEAMBOX v-for="(player, index) in players.filter(p => p?.team === 1)" :key="index" color="success"
            :host="index === 0">{{ player?.name }}</TEAMBOX>
        </section>
      </section>
      <i class="cm-switch"></i>
      <section v-if="players.filter(p => p?.team === 2).length > 0">
        <h2>Squadra 2</h2>
        <section class="team-container">
          <TEAMBOX v-for="(player, index) in players.filter(p => p?.team === 2)" :key="index" color="success">
            {{ player?.name }}</TEAMBOX>
        </section>
      </section>
    </section>
    <footer>
      <BUTTON v-if="isHost" @click="startGame" color="danger">START GAME</BUTTON>
      <!-- //TODO: Implement the startGame method -->
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
  height: 60vh;
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
