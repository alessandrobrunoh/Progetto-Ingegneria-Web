<script setup>
import TEAMBOX from "@/pages/components/TeamBox.vue";
import INVITECODE from "@/pages/components/InviteCode.vue";
import BUTTON from "@/pages/components/Button.vue";
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { io } from 'socket.io-client';

const route = useRoute();
const roomCode = ref('');
const players = ref([]);
const socket = io('http://${window.location.hostname}:8000'); // Ensure this URL matches your server URL

const userId = ref(null); // Assuming you have a way to get the current user's ID

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

onMounted(async () => {
  try {
    console.log('Fetching room code for:', route.params.roomCode); // Debugging log
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${route.params.roomCode}/players`, {
      headers: {
        'Authorization': localStorage.getItem('token') // Assuming the token is stored in localStorage
      }
    });
    roomCode.value = route.params.roomCode;
    players.value = response.data.map(player => ({
      ...player,
      ready: false // Initialize ready status
    }));
    console.log('Players:', players.value); // Debugging log

    socket.emit('joinRoom', roomCode.value);

    socket.on('playerJoined', (player) => {
      player.ready = false; // Initialize ready status
      players.value.push(player);
    });
  } catch (error) {
    console.error('Error fetching room code:', error);
  }
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
