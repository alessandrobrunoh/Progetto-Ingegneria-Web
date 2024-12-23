<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import INVITECODE from './components/InviteCode.vue';
import TEAMBOX from './components/TeamBox.vue';
import BUTTON from './components/Button.vue';
import { notification } from '../assets/js/notificationEvent';

const route = useRoute();
const code = ref(route.params.code);
const players = ref([]);
const isHost = ref(false);
const isGameStarted = ref(false);

/**
 * Ottiene il codice della stanza dalla API.
 * 
 * @returns Un Json con il codice della stanza.
 */
const getRoom = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Authorization token is missing');
    return;
  }

  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${code.value}`, {
      headers: {
      'Authorization': `Bearer ${token}`
      }
    });
    const data = response.data;
    isHost.value = data.isHost;
    isGameStarted.value = data.isGameStarted;
  } catch (error) {
    console.error('Error fetching room code:', error);
  }
};

// @todo una funzione che richiama la APi per prendere tutti i giocatori nella stanza
const getPlayers = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Authorization token is missing');
    return;
  }

  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${code.value}/players`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = response.data;
    players.value = data; 
  } catch (error) {
    console.error('Error fetching players:', error);
  }
};

const getUser = async (playerId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Authorization token is missing');
    return null;
  }

  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/user/${playerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = response.data;
    return data.username;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

const updatePlayerNames = async () => {
  for (const player of players.value) {
    player.name = await getUser(player.user_id);
  }
};

onMounted(async () => {
  await getRoom();
  await getPlayers();
  await updatePlayerNames(); 
});

onUnmounted(() => {
  // @todo implement the leave room method
});
</script>

<template>
  <section class="room-container">
    <INVITECODE :placeholder="code" />
    <section class="team-list-container">
      <section v-if="players.filter(p => p?.team === 1).length > 0">
        <h2>Squadra 1</h2>
        <section class="team-container">
          <TEAMBOX v-for="(player, index) in players.filter(p => p?.team === 1)" :key="index" color="success"
            :host="index === 0">{{ player?.name }}</TEAMBOX>
        </section>
      </section>
      <section v-if="players.filter(p => p?.team === 2).length > 0">
        <h2>Squadra 2</h2>
        <section class="team-container">
          <TEAMBOX v-for="(player, index) in players.filter(p => p?.team === 2)" :key="index" color="primary"
            :host="index === 0">{{ player?.name }}</TEAMBOX>
        </section>
      </section>
    </section>
  </section>
  <footer>
    <BUTTON v-if="isHost" @click="startGame" :color="getButtonColor()">START GAME</BUTTON>
    <!-- @todo Implement the startGame method -->
  </footer>
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
