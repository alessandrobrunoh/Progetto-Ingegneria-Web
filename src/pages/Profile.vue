<script setup>
import { notification } from "@/assets/js/notificationEvent.js";
import STATSBOX from "@/pages/components/statsBox.vue";
import BUTTON from "@/pages/components/Button.vue";
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  localStorage.removeItem('token'); // Remove the token from localStorage
  router.push('/sign-in'); // Redirect to the login page
};
</script>

<template>
  <section class="profile-container">
    <!-- <i class="fe-log-out logout-icon" @click="logout"></i> -->
    <img src="@/assets/img/avatars/Avatar-0.svg" alt="Profile Avatar" />
    <section class="statistics-container">
      <STATSBOX type="wins">Games Wins</STATSBOX>
      <STATSBOX type="loses">Games Loses</STATSBOX>
      <STATSBOX type="best">Best Points</STATSBOX>
    </section>
  </section>
  <footer>
    <BUTTON color="primary">SETTINGS</BUTTON>
    <BUTTON color="danger">CLOSE</BUTTON>
  </footer>
</template>

<style scoped>
.logout-icon {
  position: absolute;
  top: 10px;
  left: 10px;
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--primary-color);
}

img {
  width: 15rem;
  height: auto;
}

.profile-container {
  display: flex;
  width: 80vw;
  flex-direction: column;
  align-items: center;
  height: 50vh;
  gap: 5vh;
  justify-content: space-between;
  position: relative;
}

.statistics-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto;
  gap: 10px;
}

.statistics-container STATSBOX:nth-child(3) {
  grid-column: span 2;
  justify-self: center;
  align-self: center;
}
</style>