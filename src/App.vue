<template>
  <section v-if="isAuthenticated" class="profile-container">
    <router-link to="/profile">
      <img alt="Avatar Profile" src="../public/img/avatars/Avatar_0.svg"/>
    </router-link>
  </section>
  <main>
    <router-view></router-view>
  </main>
</template>

<script>
export default {
  name: 'App',
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('token');
    }
  }
}
</script>

<style scoped>
@import url('../public/style.scss');
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.profile-container {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 2vh 5vw;
}

img {
  width: 50px;
  height: auto;
  cursor: pointer;
}

img:active {
  transform: scale(0.9);
}

</style>