<script setup>
import { ref } from 'vue';

const text = ref('Briscola');

defineProps({
  text: {
    type: String,
    required: true
  }
});

text.value = title;
</script>

<template>
  <section class="titles-container">
    <h1>{{ text }}</h1>
  </section>
</template>

<style scoped>
.titles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  backdrop-filter: blur(5px);
}

h1 {
  font-size: 12rem;
  color: white;
  text-align: center;
}
</style>