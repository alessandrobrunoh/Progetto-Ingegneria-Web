<script setup>
import { ref } from 'vue';
import Button from "@/pages/components/Button.vue";
import CodeInput from "@/pages/components/CodeInput.vue";
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const joinButton = ref(true);
const roomCode = ref('');

const switchJoinButton = () => {
  joinButton.value = false;
};

const createRoom = async () => {
  try {
    const response = await axios.post(`http://${window.location.hostname}:8000/api/create-room`, {}, {
      headers: {
        'Authorization': `${localStorage.getItem('token')}` // Assuming the token is stored in localStorage
      }
    });
    const roomCode = response.data.roomCode;
    await router.push(`/room/${roomCode}`);
  } catch (error) {
    console.error('Error creating room:', error);
  }
};
</script>

<template>
  <section class="menu-container">
    <img src="https://x.boardgamearena.net/data/gamemedia/briscola/box/en_280.png?h=1693578389" alt="Vue logo"/>
    <Button @click="createRoom" color="danger">CREATE A ROOM</Button>
    <Button v-if="joinButton" @click="switchJoinButton" color="success">JOIN A ROOM</Button>
    <div v-else>
      <CodeInput v-model="roomCode" placeholder="Insert code"/>
    </div>
    <Button>RULES</Button>
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
