<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { notification } from "@/assets/js/notificationEvent.js";
import CARD from "./components/Card.vue";

const route = useRoute();
const router = useRouter();
const roomCode = ref(route.params.roomCode);
const userId = ref(null);
const isInGame = ref(false);
const isGameStarted = ref(false);
const players = ref([]);

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

async function checkPlayerInGame() {
  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${roomCode.value}/players`, {
      headers: {
        'authorization': localStorage.getItem('token')
      }
    });
    const player = response.data.find(p => p.USER_id === userId.value);
    isInGame.value = !!player;
    players.value = response.data;
  } catch (error) {
    console.error('Error checking player in game:', error);
  }
}

async function checkGameStarted() {
  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${roomCode.value}`, {
      headers: {
        'authorization': localStorage.getItem('token')
      }
    });
    isGameStarted.value = response.data[0].game_started;
  } catch (error) {
    console.error('Error checking game status:', error);
  }
}

function getCards() {
  const numberOfPlayers = players.value.length;
  if (numberOfPlayers === 2) {
    return [
      { number: 1, seed: 'Coppe' },
      { number: 2, seed: 'Bastoni' }
    ];
  } else if (numberOfPlayers === 4) {
    return [
      { number: 1, seed: 'Coppe' },
      { number: 2, seed: 'Bastoni' },
      { number: 4, seed: 'Denari' },
      { number: 7, seed: 'Spade' }
    ];
  }
  return [];
}

onMounted(async () => {
  await fetchUserId();
  await checkPlayerInGame();
  await checkGameStarted();
  if(!isGameStarted.value) {
    router.push("/");
    notification.send("Game has not started yet", "danger");
  }
  if(!isInGame.value) {
    router.push("/");
    notification.send("You are not in this game", "danger");
  }
});
</script>

<template>
  <section class="container" v-if="isInGame && isGameStarted">
    <header>
      <h2>Alessandro's Turn</h2>
    </header>
    <section class="game-table-container">
      <CARD v-for="(card, index) in getCards()" :key="index" :number="card.number" :seed="card.seed"></CARD>
    </section>
    <footer>
      <section class="players-cards">
        <CARD :number="3" seed="Bastoni"></CARD>
        <CARD :number="5" seed="Denari"></CARD>
        <CARD :number="6" seed="Coppe"></CARD>
      </section>
    </footer>
  </section>
</template>


<style scoped>
img {
  width: 50px;
  height: auto;
}

.container{
  width: 100%;
}

header {
  background-color: var(--secondary-color);
}

h2{
  color: var(--primary-color);
}

.game-table-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  height: calc(70vh - 2vh - 2vh - 4vh);
  background-color: var(--game-color);
  
  section {
    display: flex;
    flex-direction: column;
    gap: 50px;
  }
}

.players-cards {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 50px;
  background-color: var(--secondary-color);
  padding: 4vh 0;
}

footer {
  left: 0;
  width: 100%;
  bottom: 0;
}
</style>
