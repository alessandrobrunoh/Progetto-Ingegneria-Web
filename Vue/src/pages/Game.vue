<script setup>
import { ref, onMounted, onUnmounted, computed, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { notification } from "@/assets/js/notificationEvent.js";
import CARD from "./components/Card.vue";
import TITLES from "./components/Titles.vue";
import { io } from 'socket.io-client';
import { playSound, stopAllSounds } from '../assets/js/playSound';
import { getToken } from '../assets/js/getToken';
import Cookies from 'js-cookie';

const route = useRoute();
const router = useRouter();
const socket = ref(io(`http://${window.location.hostname}:8000`));
const turn_player_id = ref(null);
const turn_player_name = ref(null);
const players = ref([]);
const player_id = ref(null);
const player_hand = ref([]);
const table_cards = ref([]);
const card_disabled = ref(true);
const isLastRound = ref(false);
const cardTheme = ref(null);
const token = getToken();
const code = ref(route.params.code);
const gave_up = ref(false);
const cookies = Cookies.get("music");
if (!cookies) {
  Cookies.set("music", true);
}
const playerPoints = ref(false);

const getRoom = async () => {
  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${route.params.code}`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching room code:', error);
  }
};

const getUserID = async () => {

  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/user`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    getUserName(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching get user id:', error);
  }
};

const getPlayers = async () => {
  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${route.params.code}/players`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    return response.data.filter(player => player.gave_up === 0);
  } catch (error) {
    console.error('Error fetching players:', error);
  }
};

const isPlayerInRoom = async () => {
  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${route.params.code}/player/in_room`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching room code:', error);
  }
};

const getUserName = async (player_id) => {

  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/user/${player_id}`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    if (cardTheme.value === null) {
      cardTheme.value = response.data.cards;
    }
    return response.data.username.charAt(0).toUpperCase() + response.data.username.slice(1);
  } catch (error) {
    console.error('Error fetching get username:', error);
  }
};

const getGameTable = async () => {

  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${route.params.code}/table`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    table_cards.value = response.data;
    return response.data;
  } catch (error) {
    console.error('Error fetching game table:', error);
  }
};

const getPlayerHand = async () => {
  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${route.params.code}/player/${player_id.value}/hand`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching player hand:', error);
  }
};

const getTurnWinner = async () => {
  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${route.params.code}/turn_winner`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    if (response.data.message === "Deck is empty") {
      socket.value.emit('lastRound', route.params.code);
      handleLastRound();
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching winner:', error);
  }
};

const endGame = async () => {
  try {
    const response = await axios.post(`http://${window.location.hostname}:8000/api/room/${route.params.code}/end`, {}, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error ending game:', error);
  }
};

const isGameEnded = async () => {
  await endGame();
  router.push(`/leaderboard/${route.params.code}`);
  socket.value.emit('endGame', route.params.code);
};

const updateGameTable = async (card) => {
  table_cards.value.push(card);
  player_hand.value = await getPlayerHand();
  card_disabled.value = true;
  socket.value.emit('playCard', route.params.code, player_id.value);
  if (table_cards.value.length >= players.value.length) {
    await new Promise(resolve => setTimeout(resolve, 500));
    await getTurnWinner();
    if (player_hand.value.length === 0) {
      await isGameEnded();
    }
  }
  await updateTurnInfo();
};

const updateTurnInfo = async () => {
  players.value = await getPlayers();
  if (players.value.length <= 1) {
    await endGame();
    router.push(`/leaderboard/${route.params.code}`);
    socket.value.emit('endGame', route.params.code);
  }
  turn_player_id.value = await getRoom();
  turn_player_id.value = turn_player_id.value.turn_player_id;
  checkPlayerPoints();
  if (player_id.value == turn_player_id.value) {
    card_disabled.value = false;
    turn_player_name.value = "Your";
  } else {
    turn_player_name.value = await getUserName(turn_player_id.value) + "'s";
  }
  player_hand.value = await getPlayerHand();
  table_cards.value = await getGameTable();
};

const checkPlayerPoints = () => {
  players.value.forEach(player => {
    if (player.user_id === player_id.value && player.points > 0) {
      return playerPoints.value = true;
    }
  });
};

const handleLastRound = () => {
  isLastRound.value = true;
  if (cookies) {
    playSound("last_round");
  }
  setTimeout(() => {
    isLastRound.value = false;
  }, 1500);
};

onMounted(async () => {
  player_id.value = await getUserID();
  await updateTurnInfo();
  players.value = await getPlayers();

  if (!await isPlayerInRoom()) {
    if (cookies) {
      playSound("wrong");
    }
    router.push('/');
  }
  player_hand.value = await getPlayerHand();

  socket.value = io(`http://${window.location.hostname}:8000`);

  // Everyone joins the game to receive the game events
  socket.value.emit('joinGame', route.params.code);

  socket.value.on('turnPassed', async (player_id) => {
    await updateTurnInfo();
  });

  socket.value.on('cardPlayed', async (player_id) => {
    if (cookies) {
      stopAllSounds();
      playSound("your_turn");
    }
    socket.value.emit('passTurn', route.params.code, player_id);
    await updateTurnInfo();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await updateTurnInfo();
  });

  socket.value.on('gameEnded', async () => {
    router.push(`/leaderboard/${route.params.code}`);
  });

  socket.value.on('playerLeftGame', async () => {
    players.value = await getPlayers();
    console.log('Player left the game');
    await isGameEnded();
  });

  socket.value.on('lastRoundStarted', () => {
    handleLastRound();
  });
});

onBeforeUnmount(async () => {
  socket.value.emit('leaveGame', code.value);
  socket.value.disconnect();
});
</script>

<template>
  <section class="game-container">
    <header>
      <h2>{{ turn_player_name }} Turn</h2>
    </header>
    <section class="game-table-container">
      <CARD v-for="card in table_cards" :cardTheme="cardTheme" :number="card.number" :seed="card.seed"></CARD>
      <img v-if="playerPoints" src="https://imgur.com/ytekpOg.png" alt="Win Cards" />
    </section>
    <footer>
      <section class="players-cards">
        <CARD v-for="card in player_hand" :cardTheme="cardTheme" :number="card.number" :seed="card.seed"
          :disabled="card_disabled" @playCard="updateGameTable"></CARD>
      </section>
    </footer>
  </section>
  <div v-if="isLastRound" class="last-round-overlay">
    <h2>Last Round</h2>
  </div>
</template>

<style scoped lang="scss">
img {
  padding: 5px;
  background-color: var(--white-color);
  border-radius: 15px;
  border: 3px solid var(--white-color);
  width: 5rem;
  height: auto;
}

.game-container {
  width: 100%;
}

header {
  background-color: var(--secondary-color);
  box-shadow: var(--box-shadow);
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
  height: calc(85vh - 2vh - 2vh - 4vh);
  background-color: var(--game-color);

  section {
    display: flex;
    flex-direction: column;
    gap: 50px;

  }

  img {
    position: absolute;
    bottom: 15vh;
    right: 1vw;
    width: 6rem;
    background-color: transparent;
    border: none;
  }
}

.players-cards {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 50px;
  padding: 4vh 0;
}

@keyframes zoomIn {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes zoomOut {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}

.last-round-overlay {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 2rem;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  backdrop-filter: blur(5px);
  animation: zoomIn 0.5s forwards, zoomOut 0.5s 1.5s forwards; /* Adjust timing as needed */
}

footer {
  left: 0;
  width: 100%;
  bottom: 0;
  min-height: 22vh;
  border-radius: 15px 15px 0 0;
  background-color: var(--primary-color);
  box-shadow: var(--box-shadow-up);
}
</style>
