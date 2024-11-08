<script setup>
import { notification } from "@/assets/js/notificationEvent.js";
import Input from "./components/Input.vue";
import Button from "@/pages/components/Button.vue";
import axios from "axios";
import { ref } from "vue";
import { useRouter } from 'vue-router';

const username = ref('');
const email = ref('');
const password = ref('');
const c_password = ref('');
const router = useRouter();

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

if (isAuthenticated()) {
  router.push('/');
}

const handleSignUp = async () => {
  try {
    const response = await axios.post(`http://${window.location.hostname}:8000/api/register`, {
      username: username.value,
      email: email.value,
      password: password.value,
      c_password: c_password.value,
    });
    notification.send('Account created successfully', 'success');
    setTimeout(() => {
      router.push('/sign-in');
    }, 4000);
  } catch (error) {
    if (error.response && error.response.data) {
      notification.send('Invalid username or password', 'danger');
    }
  }
};
</script>

<template>
  <section class="signup-container">
    <img src="https://x.boardgamearena.net/data/gamemedia/briscola/box/en_280.png?h=1693578389" alt="Vue logo"/>
    <div>
      <Input v-model="username" placeholder="Username" type="username"/>
      <Input v-model="email" placeholder="Email" type="email"/>
      <Input v-model="password" placeholder="Password" type="password"/>
      <Input v-model="c_password" placeholder="Confirm Password" type="password"/>
    </div>
    <Button @click="handleSignUp">SIGN UP</Button>
    <p>
      <router-link to="/sign-in">Sign In</router-link>
      if you haven't already.
    </p>
  </section>
</template>

<style scoped>
.signup-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;
  gap: 20px;
}

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
