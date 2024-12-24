<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { notification } from "@/assets/js/notificationEvent.js";
import CARD from "./components/Card.vue";

const route = useRoute();
const router = useRouter();
const code = ref(route.params.code);
const players = ref([]);
const isGameStarted = ref(false);

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
    players.value = response.data;
  } catch (error) {
    console.error('Error fetching players:', error);
  }
};

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
    isGameStarted.value = data.status === 'in_progress';
  } catch (error) {
    console.error('Error fetching room:', error);
  }
};

const getPlayerInGame = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Authorization token is missing');
    return;
  }

  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${code.value}/player/in_game`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching room players:', error);
  }
};

function getCards() {
  const numberOfPlayers = players.value.length;
  console.log(numberOfPlayers);
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
  await getPlayers();
  await getRoom();
  if (!isGameStarted.value) {
    router.push("/");
    notification.send("Game has not started yet", "danger");
  }
  if (!getPlayerInGame()) {
    router.push("/");
    notification.send("You are not part of this game", "danger");
  }
});

onUnmounted(() => {
  
});
</script>

<template>
  <section class="container" v-if="getPlayerInGame() && isGameStarted">
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
