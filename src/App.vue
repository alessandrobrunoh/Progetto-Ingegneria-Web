<template>
  <main>
    <router-view></router-view>
  </main>
</template>

<script>
export default {
  name: 'App',
  components: {},
}
</script>

<style>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Center vertically */
  flex-grow: 1; /* Allow main to grow and fill the available space */
}
</style>
