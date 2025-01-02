<script setup>
import { defineProps, defineEmits } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { notification } from "@/assets/js/notificationEvent.js";
import { getToken } from "@/assets/js/getToken.js";

const route = useRoute();
const emits = defineEmits();
const token = getToken();

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
  emits('cardPlayed'); // Emetti l'evento quando una carta viene giocata
  await playCard();
  await passTurn();
};

const playCard = async () => {
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
  }
};

const passTurn = async () => {
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
  }
};
</script>

<template>
  <section class="card-container" @click="handleClick" :class="{ disabled: props.disabled }">
    <img :src="`/assets/img/cards/${props.cardTheme}/${props.number}_${props.seed}.svg`" alt="Card" />
  </section>
</template>

<style scoped>
img {
  width: 4.5rem;
  border-radius: 10px;
  background-color: var(--white-color);
  padding: 5px;
  box-shadow: var(--box-shadow);
  cursor: pointer;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed !important;
}
</style>