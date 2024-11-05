<script>
export default {
  name: "podium",
  props: {
    winner: {
      type: Boolean,
    },
    team: {
      type: String,
    },
    points: {
      type: Number,
    }
  },
  computed: {
    boxHeight() {
      return `${15 + this.points / 3}vh`; // Calcola l'altezza in base ai punti con un minimo di 15vh
    }
  }
}
</script>

<template>
  <section class="podium-container">
    <i v-if="winner" class="cm-crown"></i>
    <h2>{{ team }}</h2>
    <box :winner="winner" :style="{ height: boxHeight }">
      <h2>{{ points }}</h2>
      <p>points</p>
    </box>
  </section>
</template>

<style  scoped>>
box {
  padding: 15px;
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

p {
  font-size: 1.2rem;
}

box[winner="true"] {
  background-color: var(--gold-color);
  padding: 2vh 10vw;
}

box[winner="false"] {
  background-color: var(--silver-color);
  padding: 2vh 10vw;
}

.podium-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
}
</style>
