<script setup>
import CARD from './assets/Card.vue';
</script>

<template>
  <section class="game-table-container">
    <CARD :number="2" seed="Bastoni"></CARD>
    <CARD :number="4" seed="Denari"></CARD>
    <CARD :number="1" seed="Coppe"></CARD>
    <CARD :number="7" seed="Spade"></CARD>
  </section>


</template>

<style scoped>

</style>