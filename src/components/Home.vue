<script setup>
import {ref} from 'vue';
import Button from "@/components/assets/Button.vue";
import CodeInput from "@/components/assets/CodeInput.vue";
import {useRouter} from 'vue-router';

const router = useRouter();
const joinButton = ref(true);

const switchJoinButton = () => {
  joinButton.value = false;
};

const createRoom = () => {
  router.push('/room')
}
</script>

<template>
  <section class="menu">
    <img src="https://x.boardgamearena.net/data/gamemedia/briscola/box/en_280.png?h=1693578389" alt="Vue logo"/>
    <Button @click="createRoom" color="danger">CREATE A ROOM</Button>
    <Button v-if="joinButton" @click="switchJoinButton" color="success">JOIN A ROOM</Button>
    <CodeInput v-else placeholder="Insert code"/>
    <Button>RULES</Button>
  </section>
</template>

<style scoped>
.menu {
  display: flex;
  flex-direction: column;
  padding: 5vh 10vw;
  gap: 20px;
}
</style>