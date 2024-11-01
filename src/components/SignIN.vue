<script setup>
import Input from "./assets/Input.vue";
import Button from "@/components/assets/Button.vue";
import axios from "axios";
import { ref } from "vue";
import { useRouter } from 'vue-router';

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
    const response = await axios.post('http://192.168.1.57:8000/api/login', {
      username: username.value,
      password: password.value
    });
    router.push('/'); // Redirect to home page
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
  <img src="https://x.boardgamearena.net/data/gamemedia/briscola/box/en_280.png?h=1693578389" alt="Vue logo"/>
  <div>
    <Input v-model="username" placeholder="Username" type="username"/>
    <Input v-model="password" placeholder="Password" type="password"/>
  </div>
  <Button @click="handleSignIn">SIGN IN</Button>
  <p>
    <router-link to="/sign-up">Sign Up</router-link>
    if you haven''t already.
  </p>
</template>

<style scoped>
@import url("../../public/style.scss");

img {
  width: 250px;
  height: auto;
}

div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
</style>