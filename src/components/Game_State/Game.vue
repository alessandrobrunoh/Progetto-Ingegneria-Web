<template>
  <div>
    <h1>Game State</h1>
    <pre>{{ gameData }}</pre>
    <p>Score: {{ gameData.code }}</p>
  </div>
</template>

<script>
import gameData from '../../../public/data.json';

export default {
  name: 'Game',
  data() {
    return {
      gameData: null
    };
  },
  created() {
    this.gameData = gameData;
  }
};
</script>

<style scoped>
pre {
  background-color: #f4f4f4;
  padding: 10px;
  border-radius: 5px;
}
</style>