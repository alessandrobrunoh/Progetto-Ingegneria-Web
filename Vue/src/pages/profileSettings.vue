<script setup>
import { notification } from "@/assets/js/notificationEvent.js";
import INPUT from "./components/Input.vue";
import BUTTON from "./components/Button.vue";
import CHECKBOX from "./components/checkBox.vue";
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";

const username = ref("");
const email = ref("");
const password = ref("");
const avatar = ref("");
const theme = ref("");
const cardTheme = ref("");
const music = ref("");
const router = useRouter();
const player_id = ref(null);
const imageLoaded = ref(false);
const checkboxLoaded = ref(false);

const close = () => {
    router.push("/profile");
};

const cookies = Cookies.get('music') === "true";
if (!cookies) {
    Cookies.set('music', true);
}

const getUserID = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Authorization token is missing");
        return;
    }

    try {
        const response = await axios.get(`http://${window.location.hostname}:8000/api/user`, {
            headers: {
                'authorization': `Bearer ${token}`
            }
        });
        if (response.data == "Logged out successfully") {
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
    if (!token) {
        console.error("Authorization token is missing");
        return;
    }

    try {
        const response = await axios.get(`http://${window.location.hostname}:8000/api/user/${player_id.value}`, {
            headers: {
                'authorization': `Bearer ${token}`
            }
        });
        username.value = response.data.username;
        email.value = response.data.email;
        password.value = response.data.password;
        avatar.value = response.data.avatar;
        imageLoaded.value = true;
        theme.value = response.data.theme;
        cardTheme.value = response.data.cards;
        music.value = response.data.music;
        if(music.value === 1) {
            music.value = true;
        } else {
            music.value = false;
        }
        checkboxLoaded.value = true;
        return response.data;
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
        const response = await await axios.post(`http://${window.location.hostname}:8000/api/user/profile/${username.value}/${email.value}/${password.value}/${theme.value}/${avatar.value}/${cardTheme.value}/${music.value}/save`, {}, {
            headers: {
                'authorization': `Bearer ${token}`
            }
        });
        Cookies.set('music', music.value);
        notification.send("Profile saved successfully", "success");
        router.push('/');
        setTimeout(() => {
            window.location.reload();
        }, 150);
        return response.data;
    } catch (error) {
        notification.send("Error " + error, "danger");
        console.error("Error saving user data:", error);
    }
}

const changeAvatar = () => {
    if (avatar.value === 32) {
        avatar.value = 0;
    }
    avatar.value += 1;
}

const updateMusic = (value) => {
    music.value = value;
};

onMounted(async () => {
    player_id.value = await getUserID();
    await getUser();
});

</script>

<template>
    <section class="profile-settings-container">
        <section class="avatar-container">
            <img v-if="imageLoaded" :src="`/assets/img/avatars/${avatar}.svg`" alt="Profile Picture" />
            <i @click="changeAvatar" class="fe-change" @mouseover="showTooltip" @mouseleave="hideTooltip"></i>
        </section>
        <div class="input-group">
            <label for="username">Username</label>
            <INPUT v-model="username" placeholder="New Username" id="username" type="username" />
        </div>
        <div class="input-group">
            <label for="email">Email</label>
            <INPUT v-model="email" placeholder="New Email" id="email" type="email" />
        </div>
        <div class="input-group">
            <label for="password">Password</label>
            <INPUT v-model="password" placeholder="New Password" id="password" type="password" />
        </div>
        <div class="input-group">
            <label for="theme">Theme</label>
            <select v-model="theme" id="theme">
                <option value="Old Style">Old Style</option>
                <option value="Light">Light</option>
                <option value="Dark">Dark</option>
                <option value="Rusty">Rusty</option>
                <option value="Barbie">Barbie</option>
                <option value="Aloe">Aloe</option>
                <option value="Cartoon">Cartoon</option>
                <option value="Autumn">Autumn</option>
                <option value="ColorBlind">ColorBlind</option>
            </select>
        </div>
        <div class="input-group">
            <label for="cards">Cards</label>
            <select v-model="cardTheme" id="cards">
                <option value="Piacentine">Piacentine</option>
                <option value="Napoletane">Napoletane</option>
                <option value="Siciliane">Siciliane</option>
                <option value="Romagnole">Romagnole</option>
            </select>
        </div>
        <div class="input-group">
            <label for="music">Music</label>
            <CHECKBOX v-if="checkboxLoaded" id="music" :check="music" @change="updateMusic" />
        </div>
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
    color: var(--primary-color);
    font-size: 0.9rem;
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
        margin-left: 1.5rem;
    }

    i {
        font-size: 1.5rem;
    }
}

.profile-settings-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-height: calc(100vh - 45vh);
    /* Altezza massima per rendere scrollabile */
    overflow-y: auto;
    /* Abilita lo scroll verticale */
    padding: 15px;
    color: var(--primary-color);
}
</style>
