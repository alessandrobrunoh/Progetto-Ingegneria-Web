<script setup>
import {useRouter} from 'vue-router';

import {toRefs} from 'vue';

const props = defineProps({
  placeholder: {
    type: String
  }
});

const {placeholder} = toRefs(props);
const router = useRouter();

const shareCode = () => {
  navigator.clipboard.writeText(placeholder);
  alert('Code coied to clipboard');
}
</script>

<template>
  <h2>Invite Code</h2>
  <box>
    <input :placeholder="placeholder" readonly/>
    <i @click="shareCode" class="fe-share"></i>
  </box>

</template>

<style scoped>
h2 {
  color: var(--primary-color);
  margin-bottom: 1vh;
}

i {
  color: var(--secondary-color);
  border-radius: 0 15px 15px 0;
  background-color: var(--primary-color);
  cursor: pointer;
}

i:active {
  transform: scale(0.95);
}

input {
  border-radius: 15px 0 0 15px;
  border: 0 solid;
  width: 68vw;
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
  padding: 10px;
  border: 5px solid var(--primary-color);
  box-shadow: 0 4px 4px rgb(0 0 0 / 25%);
  font-size: 1.5rem;
}

box {
  display: flex;
  gap: 1vw;
}

</style>