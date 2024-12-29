<script setup>
import INPUT from "@/pages/components/Input.vue";
import BUTTON from "@/pages/components/Button.vue";
import axios from "axios";
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { notification } from "../assets/js/notificationEvent.js";
import { playSound } from "../assets/js/playSound.js";
import Cookies from 'js-cookie';

const username = ref('');
const password = ref('');
const router = useRouter();

const music = Cookies.get('music');
if (!music) {
  music = false;
}

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

if (isAuthenticated()) {
  router.push('/');
}

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    handleSignIn();
  }
};

const handleSignIn = async () => {
  try {
    const response = await axios.post(`http://${window.location.hostname}:8000/api/auth/login`, {
      username: username.value,
      password: password.value
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token); // Store token

      if (music) {
        playSound('success');
      }
      notification.send('Logged in successfully', 'success');
      router.push('/');
    } else {
      console.error('No token received');
    }
  } catch (error) {
    if (error.response && error.response.data) {
      if (music) {
        playSound('wrong');
      }
      notification.send('Invalid username or password', 'danger');
    }
  }
};
</script>

<template>
  <section class="auth-container">
    <img src="https://x.boardgamearena.net/data/gamemedia/briscola/box/en_280.png?h=1693578389" alt="Vue logo" />
    <section class="input-container">
      <INPUT v-model="username" placeholder="Username" type="username" @keypress="handleKeyPress" />
      <INPUT v-model="password" placeholder="Password" type="password" @keypress="handleKeyPress" />
    </section>
    <BUTTON @click="handleSignIn">SIGN IN</BUTTON>
    <p>
      <router-link to="/sign-up"><a>Sign Up</a></router-link>
      if you haven''t already.
    </p>
  </section>
</template>

<style scoped>
img {
  width: 250px;
  height: auto;
}

a {
  color: var(--link-color);
}

.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 90vh;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
}
</style>
