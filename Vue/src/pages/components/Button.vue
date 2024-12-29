<script setup>
import { notification } from "@/assets/js/notificationEvent.js";
import { playSound } from "../../assets/js/playSound";
import Cookies from 'js-cookie';

const sounds = () => {
  const cookies = Cookies.get('music');
  if (!cookies) {
    Cookies.set('music', true);
  }

  if(cookies === "true") {
    playSound('btn_click');
  }
}
</script>

<script>
export default {
  name: "Button",
  props: {
    color: {
      type: String,
      default: "primary"
    }
  }
}
</script>

<template>
  <button :color="color" @click="sounds()">
    <slot></slot>
  </button>
</template>

<style scoped>
button {
  padding: 15px;
  border: 0 solid;
  width: 100%;
  font-size: 1.8rem;
  color: var(--secondary-color);
  background-color: var(--primary-color);
  cursor: pointer;
  box-shadow: var(--box-shadow);
  transition: transform 0.2s;
}


button:active {
  transform: scale(0.95);
}

button[color="secondary"] {
  background-color: var(--secondary-color);
}

button[color="success"] {
  background-color: var(--success-color);
}

button[color="danger"] {
  background-color: var(--danger-color);
}

button[color="gold"] {
  background-color: var(--gold-color);
}

button[color="silver"] {
  background-color: var(--silver-color);
}

button[color="grey"] {
  background-color: var(--grey-color);
}

button[color="link"] {
  background-color: var(--link-color);
}

button:first-of-type {
  border-radius: 15px 15px 0 0;
}

button:last-of-type {
  border-radius: 0 0 15px 15px;
}

button:only-of-type {
  border-radius: 15px;
}

</style>