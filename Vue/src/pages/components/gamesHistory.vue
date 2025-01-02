<script setup>
import { ref } from 'vue';

const isVisible = ref(false);

const toggleVisibility = () => {
  isVisible.value = !isVisible.value;
};
</script>

<template>
  <section class="games-history">
    <div v-if="isVisible" class="scrollable-content">
      <!-- Contenuto della tendina -->
      <p>Dettagli del gioco...</p>
      <p>Dettagli del gioco...</p>
      <p>Dettagli del gioco...</p>
      <p>Dettagli del gioco...</p>
      <p>Dettagli del gioco...</p>
      <p>Dettagli del gioco...</p>
      <p>Dettagli del gioco...</p>
      <p>Dettagli del gioco...</p>
      <p>Dettagli del gioco...</p>
      <p>Dettagli del gioco...</p>
      <p>Dettagli del gioco...</p>
      <p>Dettagli del gioco...</p>
      <p>Dettagli del gioco...</p>
      <!-- Aggiungi qui il contenuto che vuoi mostrare/nascondere -->
    </div>
  </section>
</template>

<style scoped>
.games-history {
  /* Aggiungi qui il tuo stile */
}

.scrollable-content {
  max-height: 200px; /* Imposta l'altezza massima */
  overflow-y: scroll; /* Abilita lo scorrimento verticale */
  margin-top: 10px;
  border: 1px solid #ccc;
  padding: 10px;
}
</style>