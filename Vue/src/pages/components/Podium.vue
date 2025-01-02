<script setup>
import { notification } from "@/assets/js/notificationEvent.js";
import { computed, watch } from 'vue';
import { defineProps } from 'vue';
import { playSound } from "@/assets/js/playSound.js";

const props = defineProps({
  winner: {
    type: Boolean,
  },
  team: {
    type: String,
  },
  points: {
    type: Number,
  }
});

const boxHeight = computed(() => {
  return `${15 + props.points / 6}vh`; // Calcola l'altezza in base ai punti con un minimo di 15vh
});

</script>

<template>
  <section class="podium-container">
    <i v-if="winner" class="cm-crown"></i>
    <h2>{{ team }}</h2>
    <div class="box" :winner="winner" :style="{ height: boxHeight }">
      <h2>{{ points }}</h2>
      <p>Points</p>
    </div>
  </section>
</template>

<style scoped>
.box {
  padding: 10px;
  border: 0 solid;
  border-radius: 15px 15px 0 0;
  width: 100%;
  font-size: 1.8rem;
  color: var(--secondary-color);
  cursor: pointer;
  box-shadow: var(--box-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
}

i {
  width: 4rem;
}

p {
  font-size: 1.2rem;
}

.box[winner="true"] {
  background-color: var(--gold-color);
  padding: 2vh 9vw;
}

.box[winner="false"] {
  background-color: var(--silver-color);
  padding: 2vh 9vw;
}

.podium-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
}
</style>
