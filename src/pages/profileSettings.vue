<script setup>
import { notification } from "@/assets/js/notificationEvent.js";
import INPUT from "./components/Input.vue";
import BUTTON from "./components/Button.vue";
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from "vue-router";

const username = ref('');
const email = ref('');
const password = ref('');
const avatar = ref('');
const router = useRouter();

async function fetchUserData() {
    try {
        const response = await axios.get(`http://${window.location.hostname}:8000/api/user/`, {
            headers: {
                'authorization': localStorage.getItem('token')
            }
        });
        username.value = response.data.username;
        email.value = response.data.email;
        avatar.value = response.data.avatar;
        console.log(response.data.avatar);
        console.log(avatar.value);
    } catch (error) {
        if (error.response) {
            notification.send(`Error fetching user data: ${error.response.data.message}`, 'danger');
        } else {
            notification.send('Error fetching user data. Please try again later.', 'danger');
        }
    }
}

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

  return valid;
};

async function saveProfile() {
    if (!validateForm()) {
        return;
    }

    try {
        const response = await axios.post(`http://${window.location.hostname}:8000/api/profile/save-profile`, {
            username: username.value,
            email: email.value,
            password: password.value
        }, {
            headers: {
                'authorization': localStorage.getItem('token')
            }
        });
        notification.send('Profile updated successfully', 'success');
    } catch (error) {
        if (error.response) {
            notification.send(`Error updating profile: ${error.response.data.message}`, 'danger');
        } else {
            notification.send('Error updating profile. Please try again later.', 'danger');
        }
    }
}

function changeIcon() {
    // Logica per cambiare l'icona
}

function close() {
    router.push('/');
}

onMounted(async () => {
    await fetchUserData();
});
</script>

<template>
    <section class="profile-settings-container">
        <section class="avatar-container">
            <img src="../assets/img/avatars/Avatar-0.svg" alt="Profile Picture" />
            <i @click="changeIcon" class="fe-change"></i>
        </section>
        <INPUT v-model="username" placeholder="New Username" type="username" />
        <INPUT v-model="email" placeholder="New Email" type="email" />
        <INPUT v-model="password" placeholder="New Password" type="password" />
    </section>
    <footer>
        <BUTTON @click="saveProfile">SAVE</BUTTON>
        <BUTTON @click="close" color="danger">CLOSE</BUTTON>
    </footer>
</template>

<style>
.avatar-container {
    display: flex;
    align-items: flex-end;

    img {
        width: 15rem;
        height: auto;
    }

    i {
        font-size: 1.5rem;
    }
}



.profile-settings-container {
    display: flex;
    width: 80vw;
    flex-direction: column;
    align-items: center;
    height: 50vh;
    gap: 5vh;
    justify-content: space-between;
    position: relative;
}
</style>