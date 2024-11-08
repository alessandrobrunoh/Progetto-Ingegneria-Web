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
        const response = await axios.get(`http://${window.location.hostname}:8000/api/user`, {
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
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Reindirizza l'utente alla pagina di login
            router.push('/sign-in');
        } else {
            console.error('Error fetching user data:', error);
        }
    }
}

async function saveProfile() {
    try {
        const response = await axios.post(`http://${window.location.hostname}:8000/api/user/save-profile`, {
            username: username.value,
            email: email.value,
            password: password.value
        }, {
            headers: {
                'authorization': localStorage.getItem('token')
            }
        });
        console.log('Profile updated successfully:', response.data);
        alert('Profile updated successfully');
    } catch (error) {
        if (error.response) {
            console.error('Error updating profile:', error.response.data);
            alert(`Error updating profile: ${error.response.data.message}`);
        } else {
            console.error('Error updating profile:', error.message);
            alert('Error updating profile. Please try again later.');
        }
    }
}

function changeIcon() {
    // Logica per cambiare l'icona
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