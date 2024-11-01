<script setup>
import TEAMBOX from "@/components/assets/TeamBox.vue";
import INVITECODE from "@/components/assets/InviteCode.vue";
import BUTTON from "@/components/assets/Button.vue";
</script>

<template>
  <div class="container">
    <INVITECODE placeholder="SAHUI3"/>
    <div class="team-list-container">
      <section>
        <h2>Squadra 1</h2>
        <TEAMBOX color="success" host="true">Alessandro</TEAMBOX>
        <TEAMBOX color="danger">Dibbi</TEAMBOX>
      </section>
      <i class="cm-switch"></i>
      <section>
        <h2>Squadra 2</h2>
        <TEAMBOX color="success">Lenza</TEAMBOX>
        <TEAMBOX color="danger">Lenzo</TEAMBOX>
      </section>
    </div>
    <footer>
      <BUTTON color="danger">READY</BUTTON>
    </footer>
  </div>
</template>

<style scoped>

h2 {
  color: var(--primary-color);
  margin-bottom: 1vh;
}

.container {
  display: flex;
  width: 80vw;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1vh;
}

.cm-switch {
  display: flex;
  margin-left: auto;
  margin-top: 3vh;
}
footer {
  display: flex;
  position: fixed;
  bottom: 5vh;
  width: 80vw;
}
</style>