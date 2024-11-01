<script>
export default {
  name: "code",
    props: {
      placeholder: {
        type: String
      },
    }
}
</script>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const joinRoom = () => {
  router.push('/room')
}
</script>

<template>
  <box>
    <input :placeholder="placeholder" />
    <i @click="joinRoom" class="fe-corner-down-right"></i>
  </box>

</template>

<style scoped>
i {
  color: var(--secondary-color);
  border-radius: 0 15px 15px 0;
  background-color: var(--success-color);
  cursor: pointer;

}

i:active {
  transform: scale(0.95);
}
input {
  width: 50vw; /* Set the width to 50% */
  border-radius: 15px 0 0 15px;
  border: 0 solid;
  color: var(--dark-color);
  background-color: var(--white-color);
}

input:active,
input:focus {
  outline: none;
}

input::placeholder {
  color: var(--grey-color);
}

input,
i {
  display: flex;
  padding: 18px 20px;
  border: 4px solid var(--success-color);
  box-shadow: 0 4px 4px rgb(0 0 0 / 25%);
  font-size: 1.25rem;
}

box {
  display: flex;
  gap: 1vw;
}

</style>