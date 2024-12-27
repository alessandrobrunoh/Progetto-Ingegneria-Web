<script setup>
import { notification } from "@/assets/js/notificationEvent.js";
import { ref } from 'vue';
import BUTTON from "@/pages/components/Button.vue";
import CODEINPUT from "@/pages/components/CodeInput.vue";
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const joinButton = ref(true);
const code = ref('');

const switchJoinButton = () => {
  joinButton.value = false;
};

const createRoom = async () => {
  try {
    const response = await axios.post(`http://${window.location.hostname}:8000/api/room/create`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const code = response.data;
    router.push(`/room/${code}`);
  } catch (error) {
    console.error('Error creating room:', error);
  }
};

const browseRooms = () => {
  router.push('/rooms');
};

const rules = () => {
  router.push('/rules');
};
</script>

<template>
  <section class="menu-container">
    <img src="https://x.boardgamearena.net/data/gamemedia/briscola/box/en_280.png?h=1693578389" alt="Vue logo"/>
    <BUTTON @click="browseRooms" color="link">BROWSE ROOMS</BUTTON>
    <BUTTON @click="createRoom" color="danger">CREATE A ROOM</BUTTON>
    <BUTTON v-if="joinButton" @click="switchJoinButton" color="success">JOIN A ROOM</BUTTON>
    <div v-else>
      <CODEINPUT v-model="code"/>
    </div>
    <BUTTON @click="rules">RULES</BUTTON>
  </section>
</template>

<style scoped>
.menu-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  padding: 5vh 15vw;
  gap: 20px;
}

button {
  border-radius: 15px !important;
}
</style>
