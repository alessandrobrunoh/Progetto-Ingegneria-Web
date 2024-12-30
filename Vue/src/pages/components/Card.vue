<script setup>
import { defineProps, defineEmits } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { notification } from "@/assets/js/notificationEvent.js";

const route = useRoute();
const emits = defineEmits();

const props = defineProps({
  number: {
    type: Number,
    required: true
  },
  seed: {
    type: String,
    required: true,
    validator(value) {
      return ['Denari', 'Coppe', 'Spade', 'Bastoni'].includes(value);
    }
  },
  disabled: {
    type: Boolean,
    default: false
  },
  cardTheme: {
    type: String,
    required: true
  }
});

const handleClick = async () => {
  if (props.disabled) {
    return;
  }
  await playCard();
  await passTurn();
};

const playCard = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Authorization token is missing');
    return;
  }

  try {
    const response = await axios.post(`http://${window.location.hostname}:8000/api/room/${route.params.code}/player/play/${props.number}/${props.seed}`, {}, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    emits('playCard', response.data); // Emetti l'evento con i dati della carta giocata
    return response.data;
  } catch (error) {
    console.error('Error playing card:', error);
    notification.send("Error playing card:", "danger");
  }
};

const passTurn = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Authorization token is missing');
    return;
  }

  try {
    const response = await axios.post(`http://${window.location.hostname}:8000/api/room/${route.params.code}/player/pass`, {}, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    emits('passTurn', response.data); // Emetti l'evento con i dati del turno passato
    return response.data;
  } catch (error) {
    console.error('Error passing turn:', error);
    notification.send("Error passing turn:", "danger");
  }
};
</script>

<template>
  <section class="card-container" @click="handleClick" :class="{ disabled: disabled }">
    <img :src="`/assets/img/cards/${cardTheme}/${number}_${seed}.svg`" alt="Card" />
  </section>
</template>

<style scoped>
img {
  width: 4rem;
  border-radius: 10px;
  background-color: var(--white-color);
  border: 3px solid var(--primary-color);
  padding: 5px;
  box-shadow: var(--box-shadow);
  cursor: pointer;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed !important;
}

</style>