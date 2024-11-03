<script setup>
import TEAMBOX from "@/components/assets/TeamBox.vue";
import INVITECODE from "@/components/assets/InviteCode.vue";
import BUTTON from "@/components/assets/Button.vue";
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const roomCode = ref('');

onMounted(async () => {
  try {
    console.log('Fetching room code for:', route.params.roomCode); // Debugging log
    const response = await axios.get(`http://192.168.1.57:8000/api/room/${route.params.roomCode}`, {
      headers: {
        'Authorization': localStorage.getItem('token') // Assuming the token is stored in localStorage
      }
    });
    roomCode.value = route.params.roomCode;
    console.log('Room code set to:', route.params.roomCode); // Debugging log
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
        <TEAMBOX color="success" host="true">Alessandro</TEAMBOX>
        <TEAMBOX color="danger">Dibbi</TEAMBOX>
      </section>
      <i class="cm-switch"></i>
      <section class="team-container">
        <h2>Squadra 2</h2>
        <TEAMBOX color="success">Lenza</TEAMBOX>
        <TEAMBOX color="danger">Lenzo</TEAMBOX>
      </section>
    </section>
    <footer>
      <BUTTON color="danger">READY</BUTTON>
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