<script setup>
import { notification } from "@/assets/js/notificationEvent.js";
import CARD from "./components/Card.vue";
</script>

<template>
  <section class="container">
    <header>
      <h2>Alessandro's Turn</h2>
    </header>
    <section class="game-table-container">
      <CARD :number="1" seed="Coppe"></CARD>
      <section>
        <CARD :number="2" seed="Bastoni"></CARD>
        <CARD :number="4" seed="Denari"></CARD>
      </section>
      <CARD :number="7" seed="Spade"></CARD>
    </section>
    <footer>
      <section class="players-cards">
        <CARD :number="3" seed="Bastoni"></CARD>
        <CARD :number="5" seed="Denari"></CARD>
        <CARD :number="6" seed="Coppe"></CARD>
      </section>
    </footer>
  </section>
</template>

<style scoped>
img {
  width: 50px;
  height: auto;
}

.container{
  width: 100%;
}

header {
  background-color: var(--secondary-color);
  display: flex;
  justify-content: center;
}
h2{
  color: var(--primary-color);
}

.game-table-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  background-color: var(--game-color);
  
  section {
    display: flex;
    flex-direction: column;
    gap: 50px;
  }
}

.players-cards {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 50px;
}
</style>
