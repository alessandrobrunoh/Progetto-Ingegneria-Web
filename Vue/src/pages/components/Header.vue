<script setup>
import { onBeforeMount, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getToken } from '../../assets/js/getToken.js';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const token = getToken();

const avatar = ref(1);

const getUserID = async () => {
  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/user`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching get user id:', error);
  }
};

const getAvatar = async () => {
  try {
    const response = await axios.get(`http://${window.location.hostname}:8000/api/user/${await getUserID()}`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    return response.data.avatar;
  } catch (error) {
    console.error('Error fetching get user id:', error);
  }
};

onBeforeMount(async () => {
  avatar.value = await getAvatar();
});
</script>

<template>
  <section class="profile-icon-container">
    <router-link to="/"><img src="https://i.imgur.com/v9LaPxu.png" alt="Click to go Home" /></router-link>
    <router-link to="/profile"><img alt="Avatar Profile" :src="`../assets/img/avatars/${avatar}.svg`" /></router-link>
  </section>
</template>

<style scoped>
.profile-icon-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2vh 5vw 0 5vw;
}

img {
  width: 3.5em;
  height: auto;
  cursor: pointer;
}

img.briscola {
  cursor: default !important;
  padding: 5px;
  border-radius: 15px;
  background-color: var(--white-color);
  border: 3px solid var(--primary-color);
}

img:active {
  transform: scale(0.9);
}
</style>