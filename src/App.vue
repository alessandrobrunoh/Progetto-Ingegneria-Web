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
  padding: 0 50px;
  display: flex;
  height: 90vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 50px;
}
</style>
