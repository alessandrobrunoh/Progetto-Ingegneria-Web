<script setup>
import { notification } from "@/assets/js/notificationEvent.js";
</script>

<script>
export default {
  name: "card",
  props: {
    number: {
      type: Number,
      required: true
    },
    seed: {
      type: String,
      required: true,
      validator(value) {
        // The value must match one of these strings
        return ['Denari', 'Coppe', 'Spade', 'Bastoni'].includes(value);
      }
    }
  }
}
</script>

<template>
  <section class="card-container">
    <box>
      <h2>{{ number }}</h2>
      <p>{{ seed }}</p>
    </box>
  </section>
</template>

<style scoped>
box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 15vw;
  height: 13vh;
  border-radius: 15px;
  background-color: var(--primary-color);
  color: var(--secondary-color);
  box-shadow: var(--box-shadow);
}

.card-container{

}
</style>