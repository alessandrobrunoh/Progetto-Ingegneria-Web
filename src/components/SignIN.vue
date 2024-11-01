<script setup>
import Input from "./assets/Input.vue";
import Button from "@/components/assets/Button.vue";
import axios from "axios";
import { ref } from "vue";
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const router = useRouter();

const handleSignIn = async () => {
  try {
    const response = await axios.post('http://localhost:8000/api/login', {
      username: username.value,
      password: password.value
    });
    localStorage.setItem('token', response.data.token); // Store the token
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
    <input v-model="username" placeholder="Username" type="username"/>
    <input v-model="password" placeholder="Password" type="password"/>
  </div>
  <Button @click="handleSignIn">SIGN IN</Button>
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
  gap: 10px;
}
</style>