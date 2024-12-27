<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { notification } from "@/assets/js/notificationEvent.js";
import BROWSEBOX from "./components/browseBox.vue";
import BUTTON from "./components/Button.vue";

const rooms = ref([]);
const filteredRooms = ref([]);
const showWaitingOnly = ref(false);

const getRooms = async () => {
    try {
        const response = await axios.get(`http://${window.location.hostname}:8000/api/room/browse`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.data === "Logged out successfully") {
            notification.send("Logged out Successfully", "success");
            localStorage.removeItem('token');
            router.push('/sign-up');
            return;
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching rooms:', error);
        notification.send("Error fetching rooms", "danger");
    }
};

const filterRooms = () => {
    if (showWaitingOnly.value) {
        filteredRooms.value = rooms.value.filter(room => room.status === 'waiting');
    } else {
        filteredRooms.value = rooms.value;
    }
};

// Funzione per ottenere tutte le stanze e i giocatori
const getRoomsPlayers = async (code) => {
    try {
        const response = await axios.get(`http://${window.location.hostname}:8000/api/room/${code}/players`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log('players:', response.data);
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
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log(`Room ${roomCode} deleted successfully`);
    } catch (error) {
        console.error(`Error deleting room ${roomCode}:`, error);
    }
};

// Funzione per controllare e cancellare stanze con 0 giocatori
const checkAndDeleteEmptyRooms = async () => {
    const rooms = await getRooms();
    for (const room of rooms) {
        const players = await getRoomsPlayers(room.code)
        if (players.length === 0) {
            await deleteRoom(room.code);
        }
    }
};

// Funzione per aggiornare le stanze
const refreshRooms = async () => {
    await checkAndDeleteEmptyRooms();
    rooms.value = await getRooms();
    filterRooms();
};

// Esegui il controllo delle stanze vuote al montaggio del componente
onMounted(async () => {
    await checkAndDeleteEmptyRooms();
    rooms.value = await getRooms();
    filterRooms();
    setInterval(async () => {
        await checkAndDeleteEmptyRooms();
        rooms.value = await getRooms();
        filterRooms();
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
            <BROWSEBOX v-for="room in filteredRooms" :key="room.code" :code="room.code" :status="room.status" />
        </ul>
    </section>
</template>

<style scoped>
.browser-container {
    display: flex;
    flex-direction: column;
    padding: 5vh 15vw;
    gap: 20px;
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
}

.refresh-button {
    padding: 10px 20px;
    font-size: 1rem;
    cursor: pointer;
}
</style>