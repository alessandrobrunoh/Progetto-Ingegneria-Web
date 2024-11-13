<script setup>
import { notification } from "@/assets/js/notificationEvent.js";
import INPUT from "./components/Input.vue";
import BUTTON from "@/pages/components/Button.vue";
import axios from "axios";
import { ref } from "vue";
import { useRouter } from 'vue-router';

const username = ref('');
const email = ref('');
const password = ref('');
const c_password = ref('');
const router = useRouter();

const errors = ref({
  username: '',
  email: '',
  password: '',
  c_password: ''
});

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validateForm = () => {
  let valid = true;

  if (!username.value) {
    notification.send('Username is required', 'danger');
    valid = false;
  }

  if (!email.value) {
    notification.send('Email is required', 'danger');
    valid = false;
  } else if (!validateEmail(email.value)) {
    notification.send('Invalid email format', 'danger');
    valid = false;
  }

  if (!password.value) {
    notification.send('Password is required', 'danger');
    valid = false;
  } else if (password.value.length < 8) {
    notification.send('Password must be at least 8 characters', 'danger');
    valid = false;
  }

  if (!c_password.value) {
    notification.send('Confirm Password is required', 'danger');
    valid = false;
  } else if (c_password.value !== password.value) {
    notification.send('Passwords do not match', 'danger');
    valid = false;
  }

  return valid;
};

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

if (isAuthenticated()) {
  router.push('/');
}

const handleSignUp = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    const response = await axios.post(`http://${window.location.hostname}:8000/api/register`, {
      username: username.value,
      email: email.value,
      password: password.value
    });
    notification.send('Registration successful', 'success');
    //router.push('/sign-in');
  } catch (error) {
    if (error.response && error.response.data) {
      notification.send('Registration failed', 'danger');
    }
  }
};
</script>

<template>
  <section class="signup-container">
    <img src="https://x.boardgamearena.net/data/gamemedia/briscola/box/en_280.png?h=1693578389" alt="Vue logo"/>
    <div>
      <INPUT v-model="username" placeholder="Username" type="username"/>
      <INPUT v-model="email" placeholder="Email" type="email"/>
      <INPUT v-model="password" placeholder="Password" type="password"/>
      <INPUT v-model="c_password" placeholder="Confirm Password" type="password"/>
    </div>
    <BUTTON @click="handleSignUp">SIGN UP</BUTTON>
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
