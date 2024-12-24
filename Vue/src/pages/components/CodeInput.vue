<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { notification } from '@/assets/js/notificationEvent';
import { playSound } from '../../assets/js/playSound';

const code = ref('');
const router = useRouter();

const joinRoom = async () => {
  playSound('btn_click');
  const token = localStorage.getItem('token');
  if (!token) {
    notification.send('You must be logged in to join a room', 'danger');
    return;
  }

  try {
    // Verifica se il codice della stanza esiste
    const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${code.value}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data.code.length > 0) {
      // Se il codice esiste, procedi con il join
      const response = await axios.post(`http://${window.location.hostname}:8000/api/room/${code.value}/join`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      playSound('success');
      notification.send('Room joined successfully', 'success');
      router.push(`/room/${code.value}`);
    } else {
      // Se il codice non esiste, mostra una notifica di errore
      playSound('danger');
      notification.send('Room code does not exist', 'danger');
    }
  } catch (error) {
    playSound('danger');
    notification.send('The room code is invalid', 'danger');
  }
};
</script>

<template>
  <div class="box">
    <input placeholder="Insert Code here" v-model="code" />
    <i @click="joinRoom" class="fe-corner-down-right"></i>
  </div>
</template>

<style scoped>
i {
  color: var(--secondary-color);
  border-radius: 0 15px 15px 0;
  background-color: var(--success-color);
  cursor: pointer;
}

i:active {
  transform: scale(0.95);
}

input {
  width: 50vw;
  /* Set the width to 50% */
  border-radius: 15px 0 0 15px;
  border: 0 solid;
  color: var(--dark-color);
  background-color: var(--white-color);
}

input:active,
input:focus {
  outline: none;
}

input::placeholder {
  color: var(--grey-color);
}

input,
i {
  display: flex;
  padding: 18px 20px;
  border: 4px solid var(--success-color);
  box-shadow: 0 4px 4px rgb(0 0 0 / 25%);
  font-size: 1.25rem;
}

.box {
  display: flex;
  gap: 1vw;
}
</style>
