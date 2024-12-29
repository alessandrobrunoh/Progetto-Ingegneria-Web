<script setup>
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  check: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['change']);

const isChecked = ref(props.check);
console.log(props.check);
const toggleCheckbox = () => {
  isChecked.value = !isChecked.value;
  emits('change', isChecked.value);
};
</script>

<template>
  <section class="checkbox-container" @click="toggleCheckbox">
    <input type="checkbox" v-model="isChecked" />
    Music
    <span class="switch"></span>
  </section>
</template>

<style scoped>
.checkbox-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border: 4px solid var(--success-color);
  border-radius: 15px;
  width: 60vw;
  background-color: var(--white-color);
  box-shadow: 0 4px 4px rgb(0 0 0 / 25%);
  position: relative;
  cursor: pointer;
}

input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.switch {
  position: relative;
  width: 2.5rem;
  height: 20px;
  background-color: var(--white-color);
  border: 2px solid var(--success-color);
  border-radius: 20px;
  transition: 0.4s;
}

.switch:before {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  left: 3px;
  bottom: 2px;
  background-color: var(--success-color);
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .switch {
  background-color: var(--success-color);
}

input:checked + .switch:before {
  transform: translateX(20px);
  background-color: var(--white-color);
}
</style>