<script>
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ref, watch } from 'vue';

export default {
  name: "code",
  props: {
    modelValue: {
      type: String,
      required: true
    },
    placeholder: {
      type: String
    }
  },
  setup(props) {
    const router = useRouter();
    const roomCode = ref(props.modelValue);

    watch(() => props.modelValue, (newValue) => {
      roomCode.value = newValue;
    });

    const joinRoom = async () => {
      try {
        console.log('Joining room with code:', roomCode.value); // Debugging log
	      const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${roomCode.value}`, {
          headers: {
            'Authorization': localStorage.getItem('token') // Assuming the token is stored in localStorage
          }
        });
        if (response.data.length > 0) {
          // Add user to the players table
          await axios.post(`http://192.168.1.85:8000/api/room/${roomCode.value}/add-player`, {}, {
            headers: {
              'Authorization': localStorage.getItem('token') // Assuming the token is stored in localStorage
            }
          });
          await router.push(`/room/${roomCode.value}`);
        } else {
          console.error('Room does not exist');
          alert('Room does not exist');
        }
      } catch (error) {
        console.error('Error joining room:', error);
      }
    };

    return {
      roomCode,
      joinRoom
    };
  }
};
</script>

<template>
  <box>
    <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" :placeholder="placeholder" />
    <i @click="joinRoom" class="fe-corner-down-right"></i>
  </box>
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
  width: 50vw; /* Set the width to 50% */
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

box {
  display: flex;
  gap: 1vw;
}
</style>
