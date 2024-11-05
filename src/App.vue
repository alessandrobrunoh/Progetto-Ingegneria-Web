<template>
  <section v-if="isAuthenticated" class="profile-icon-container">
    <router-link to="/profile">
      <img alt="Avatar Profile" src="assets/img/avatars/Avatar_0.svg"/>
    </router-link>
  </section>
  <main>
    <router-view></router-view>
  </main>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'App',
  setup() {
    const isAuthenticated = ref(false);

    const checkAuth = () => {
      isAuthenticated.value = !!localStorage.getItem('token');
    };

    onMounted(() => {
      checkAuth();
      window.addEventListener('storage', checkAuth);
    });

    return {
      isAuthenticated
    };
  }
}
</script>

<style scoped>
@import url('assets/css/style.scss');
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.profile-icon-container {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 2vh 5vw 0 5vw;
}

img {
  width: 50px;
  height: auto;
  cursor: pointer;
  border-radius: 50%;
}

img:active {
  transform: scale(0.9);
}
</style>