<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { notification } from "@/assets/js/notificationEvent.js";
import CARD from "./components/Card.vue";
import TITLES from "./components/Titles.vue";
import { io } from 'socket.io-client';
import { playSound } from '../assets/js/playSound';

const route = useRoute();
const router = useRouter();
const socket = ref(io(`http://${window.location.hostname}:8000`));
const turn_player_id = ref(null);
const turn_player_name = ref(null);
const player_id = ref(null);
const player_hand = ref([]);
const table_cards = ref([]);
const card_disabled = ref(true);
const Loaded = ref({
  getRoom: false,
  getGameTable: false,
  getPlayerHand: false,
});
const cardTheme = ref(null);

/**
 * Ottiene le informazioni della stanza di gioco.
 * 
 * @returns Un Json con le informazioni della stanza di gioco.
 * 
 * @throws {Error} Se il token di autorizzazione è mancante.
 * @throws {Error} Se si verifica un errore durante la richiesta API.
 * @throws {Error} Se la stanza non è stata trovata.
 * @throws {Error} Se la stanza non è stata avviata.
 */
const getRoom = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Authorization token is missing');
    return;
  }

  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${route.params.code}`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });

    // If the room is not found, redirect to the home page
    if (response.data.length === 0) {
      notification.send("Game not found", "danger");
      return router.push('/');
    }

    // If the room is not started, redirect to the home page
    if (response.data.status != "in_progress") {
      notification.send("Game not started", "danger");
      return router.push('/');
    }
    Loaded.getRoom = true;
    return response.data;
  } catch (error) {
    console.error('Error fetching room code:', error);
  }
};

/**
 * Ottiene la lista dei giocatori della stanza di gioco.
 * 
 * @returns Un Json con la lista dei giocatori della stanza di gioco.
 * 
 * @throws {Error} Se il token di autorizzazione è mancante.
 * @throws {Error} Se si verifica un errore durante la richiesta API.
 */
const isPlayerInRoom = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Authorization token is missing');
    return;
  }

  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${route.params.code}/player/in_room`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });

    if (!response.data) {
      notification.send("Player not Found in Game", "danger");
      return router.push('/');
    }

    return response.data;
  } catch (error) {
    router.push('/');
    console.error('Error fetching room code:', error);
  }
};

const getUserName = async (player_id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Authorization token is missing');
    return;
  }

  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/user/${player_id}`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    console.log(response.data);
    cardTheme.value = response.data.cards;
    return response.data.username.charAt(0).toUpperCase() + response.data.username.slice(1);
  } catch (error) {
    console.error('Error fetching get username:', error);
  }
};

const getGameTable = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Authorization token is missing');
    return;
  }

  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${route.params.code}/table`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    table_cards.value = response.data;
    Loaded.getGameTable = true;
    return response.data;
  } catch (error) {
    console.error('Error fetching game table:', error);
  }
};

const getPlayerHand = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Authorization token is missing');
    return;
  }

  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${route.params.code}/player/${player_id.value}/hand`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    Loaded.getPlayerHand = true;
    return response.data;
  } catch (error) {
    console.error('Error fetching player hand:', error);
  }
};

const drawCard = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Authorization token is missing');
    return;
  }

  try {
    const response = await axios.post(`http://${window.location.hostname}:8000/api/room/${route.params.code}/player/draw`, {}, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    player_hand.value.push(response.data);
    return response.data;
  } catch (error) {
    console.error('Error drawing card:', error);
  }
};

const getUserID = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Authorization token is missing');
    return;
  }

  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/user`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching get user id:', error);
  }
};

const updateGameTable = async (card) => {
  table_cards.value.push(card);
  player_hand.value = await getPlayerHand();
  socket.value.emit('playCard', route.params.code, player_id.value);
  card_disabled.value = true;
  await updateTurnInfo();
};

const updateTurnInfo = async () => {
  table_cards.value = await getGameTable();
  turn_player_id.value = await getRoom();
  turn_player_id.value = turn_player_id.value.turn_player_id;
  player_hand.value = await getPlayerHand();
  if (player_id.value == turn_player_id.value) {
    card_disabled.value = false;
    turn_player_name.value = "Your";
  } else {
    turn_player_name.value = await getUserName(turn_player_id.value) + "'s";
  }
};

const isAllLoaded = () => {
  if (Loaded.getRoom && Loaded.getGameTable && Loaded.getPlayerHand) {
    return true;
  }
};

onMounted(async () => {
  player_id.value = getUserID();
  turn_player_id.value = getRoom();
  turn_player_id.value = turn_player_id.value.turn_player_id;
  await updateTurnInfo();

  socket.value = io(`http://${window.location.hostname}:8000`);

  // Everyone joins the game to receive the game events
  socket.value.emit('joinGame', route.params.code);

  socket.value.on('turnPassed', async (player_id) => {
    drawCard();
    await updateTurnInfo();
  });

  socket.value.on('cardPlayed', async (player_id) => {
    await updateTurnInfo();
    socket.value.emit('passTurn', route.params.code, player_id);
  });
});

onUnmounted(async () => {
  socket.value.disconnect();
});
</script>

<template>
  <section v-if="isAllLoaded" class="game-container">
    <header>
      <h2>{{ turn_player_name }} Turn</h2>
    </header>
    <section class="game-table-container">
      <CARD v-for="card in table_cards" :cardTheme="cardTheme" :number="card.number" :seed="card.seed" disabled></CARD>
    </section>
    <footer>
      <section class="players-cards">
        <CARD v-for="card in player_hand" :cardTheme="cardTheme" :number="card.number" :seed="card.seed" :disabled="card_disabled"
          @playCard="updateGameTable"></CARD>
      </section>
    </footer>
  </section>
</template>

<style scoped>
img {
  padding: 5px;
  background-color: var(--white-color);
  border-radius: 15px;
  border: 3px solid var(--primary-color);
  width: 5rem;
  height: auto;
}

.game-container {
  width: 100%;
}

header {
  background-color: var(--secondary-color);
}

h2 {
  color: var(--primary-color);
  text-align: center;
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
