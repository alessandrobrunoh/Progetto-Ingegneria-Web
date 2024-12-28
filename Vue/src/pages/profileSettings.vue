<script setup>
import { notification } from "@/assets/js/notificationEvent.js";
import INPUT from "./components/Input.vue";
import BUTTON from "./components/Button.vue";
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const username = ref("");
const email = ref("");
const password = ref("");
const avatar = ref("");
const theme = ref("");
const router = useRouter();
const player_id = ref(null);
const tooltipVisible = ref(false);

const close = () => {
    router.push("/");
};

const getUserID = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Authorization token is missing");
        return;
    }

    try {
        const response = await axios.get(`http://${window.location.hostname}:8000/api/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if(response.data == "Logged out successfully") {
            notification.send("Session expired, please log in again", "danger");
            return router.push("/");
        }
        return response.data;
    } catch (error) {
        console.error("Error fetching user ID:", error);
    }
}

const getUser = async () => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.get(`http://${window.location.hostname}:8000/api/user/${player_id.value}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        username.value = response.data.username;
        email.value = response.data.email;
        password.value = response.data.password;
        avatar.value = response.data.avatar;
        theme.value = response.data.theme;
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

const saveProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Authorization token is missing");
        return;
    }

    try {
        const response = await axios.post(`http://${window.location.hostname}:8000/api/user/profile/${username.value}/${email.value}/${password.value}/${theme.value}/${avatar.value}/save`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        notification.send("Profile updated successfully", "success");
        window.location.reload();
        return response.data;
    } catch (error) {
        notification.send("Error:" +  error, "danger");
        console.error("Error updating user data:", error);
    }
}

const changeAvatar = () => {
    const avatars = Array.from({ length: 32 }, (_, i) => i + 1);
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    avatar.value = randomAvatar;
}

onMounted(async () => {
    player_id.value = await getUserID();
    await getUser();
});

</script>

<template>
    <section class="profile-settings-container">
        <section class="avatar-container">
            <img :src="`/assets/img/avatars/${avatar}.svg`" alt="Profile Picture"/>
            <i @click="changeAvatar" class="fe-change" @mouseover="showTooltip" @mouseleave="hideTooltip"></i>
        </section>
        <INPUT v-model="username" placeholder="New Username" type="username" />
        <INPUT v-model="email" placeholder="New Email" type="email" />
        <INPUT v-model="password" placeholder="New Password" type="password" />
        <select v-model="theme">
            <option value="Old Style">Old Style</option>
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
            <option value="Barbie">Barbie</option>
            <option value="Camo">Camo</option>
            <!-- Aggiungi altre opzioni se necessario -->
        </select>
    </section>
    <footer>
        <BUTTON @click="saveProfile">SAVE</BUTTON>
        <BUTTON @click="close" color="danger">CLOSE</BUTTON>
    </footer>
</template>

<style>
select {
  display: flex;
  gap: 10px;
  padding: 15px;
  border: 4px solid var(--success-color);
  border-radius: 15px;
  flex-direction: row;
  width: 60vw;
  background-color: var(--white-color);
  box-shadow: 0 4px 4px rgb(0 0 0 / 25%); 
} 

i:hover {
    cursor: pointer;
}

.avatar-container {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;

    img {
        width: 20vw;
        height: auto;
    }

    i {
        font-size: 1.5rem;
    }
}

.profile-settings-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2vh;
    justify-content: space-between;
    position: relative;
}
</style>
