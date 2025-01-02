<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import axios from "axios";
import { notification } from "@/assets/js/notificationEvent.js";
import BROWSEBOX from "./components/browseBox.vue";
import BUTTON from "./components/Button.vue";
import { getToken } from "../assets/js/getToken";

const rooms = ref([]);
const token = getToken();
const filteredRooms = ref([]);

const getRooms = async () => {
    try {
        const response = await axios.get(`http://${window.location.hostname}:8000/api/room/browse`, {
            headers: {
                'authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching rooms:', error);
        notification.send("Error fetching rooms", "danger");
        return [];
    }
};

// Funzione per ottenere tutte le stanze e i giocatori
const getRoomsPlayers = async (code) => {
    try {
        const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${code}/players`, {
            headers: {
                'authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching rooms:', error);
        return [];
    }
};

// Funzione per cancellare una stanza
const deleteRoom = async (roomCode) => {
    try {
        await axios.delete(`http://${window.location.hostname}:8000/api/room/${roomCode}/delete`, {
            headers: {
                'authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting room ${roomCode}:`, error);
    }
};

// Funzione per controllare e cancellare stanze con 0 giocatori
const checkAndDeleteEmptyRooms = async () => {
    const rooms = await getRooms();
    for (const room of rooms) {
        const players = await getRoomsPlayers(room.code);
        if (players.length === 0) {
            await deleteRoom(room.code);
        }
    }
};

// Funzione per aggiornare le stanze
const refreshRooms = async () => {
    await checkAndDeleteEmptyRooms();
    rooms.value = await getRooms();
    filteredRooms.value = [];
    for (const room of rooms.value) {
        if (room.status === "waiting") {
            filteredRooms.value.push(room);
        }
    }
};

// Esegui il controllo delle stanze vuote al montaggio del componente 
onBeforeMount(async () => {
    await refreshRooms();

    setInterval(async () => {
        await refreshRooms();
    }, 10000);
});
</script>

<template>
    <section class="browser-container">
        <div class="header">
            <h1>Browse All Rooms:</h1>
            <BUTTON @click="refreshRooms" class="refresh-button">
                Refresh
            </BUTTON>
        </div>
        <ul>
            <BROWSEBOX v-for="room in filteredRooms" :key="room.code" :code="room.code"/>
        </ul>
    </section>
</template>

<style scoped>
.browser-container {
    display: flex;
    flex-direction: column;
    padding: 5vh 5vw;
    gap: 20px;
    width: 50%;
}

ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    padding: 10px 20px;
    font-size: 1rem;
    cursor: pointer;
    width: 20%;
}

.refresh-button {
    padding: 10px 20px;
    font-size: 1rem;
    cursor: pointer;
}
</style>