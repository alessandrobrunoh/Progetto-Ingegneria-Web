<script setup>
import INPUT from "./components/Input.vue";
import BUTTON from "@/pages/components/Button.vue";
import axios from "axios";
import {ref} from "vue";
import {useRouter} from 'vue-router';

const username = ref('');
const password = ref('');
const router = useRouter();

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

if (isAuthenticated()) {
  router.push('/');
}

const handleSignIn = async () => {
  try {
    const response = await axios.post(`http://${window.location.hostname}:8000/api/login`, {
      username: username.value,
      password: password.value
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token); // Store token
      await router.push('/'); // Redirect to home page
    } else {
      console.error('No token received');
    }
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
  }
};
</script>

<template>
  <section class="auth-container">
    <img src="https://x.boardgamearena.net/data/gamemedia/briscola/box/en_280.png?h=1693578389" alt="Vue logo"/>
    <section class="input-container">
      <INPUT v-model="username" placeholder="Username" type="username"/>
      <INPUT v-model="password" placeholder="Password" type="password"/>
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