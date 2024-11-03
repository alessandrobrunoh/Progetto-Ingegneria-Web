<script setup>
import PODIUM from "@/components/assets/Podium.vue";
import BUTTON from "@/components/assets/Button.vue";
</script>

<template>
  <section class="container">
    <h1>Te la sei vista brutta eh!</h1>
    <section class="leaderboard-container">
      <PODIUM :winner="true" team="Squadra 1" points=100></PODIUM>
      <PODIUM :winner="false" team="Squadra 2" points=20></PODIUM>
    </section>
    <footer>
      <router-link to="/">
        <BUTTON color="primary">GO HOME</BUTTON>
      </router-link>
    </footer>
  </section>
</template>

<style scoped>
.leaderboard-container{
  display: flex;
  gap: 40px;
}
h1{
  color: var(--primary-color);
  font-size: 1.5rem;
  text-align: center;
}

.container{
  display: flex;
  width: 80vw;
  flex-direction: column;
  align-items: center;
  height: 70dvh;
  gap: 5vh;
  justify-content: space-between;
}

</style>