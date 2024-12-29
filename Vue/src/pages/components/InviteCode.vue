<script setup>
import { notification } from "@/assets/js/notificationEvent.js";
import { useRouter } from 'vue-router';
import { toRefs } from 'vue';
import { playSound } from "../../assets/js/playSound";
import Cookies from 'js-cookie';

const props = defineProps({
  placeholder: {
    type: String
  }
});

const { placeholder } = toRefs(props);
const router = useRouter();

const cookies = Cookies.get('music');
if (!cookies) {
  Cookies.set('music', true);
}

const shareCode = () => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(placeholder.value)
      .then(() => {
        notification.send("Code copied to clipboard", "success");
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  } else {
    // Fallback method
    const textarea = document.createElement('textarea');
    textarea.value = placeholder.value;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      if(cookies === "true") {
        playSound("btn_click");
      }
      notification.send("Code copied to clipboard", "success");
    } catch (err) {
      console.error('Failed to copy: ', err);
      notification.send("Failed to copy code", "danger");
    }
    document.body.removeChild(textarea);
  }
}
</script>

<template>
  <section class="invitecode-container">
    <h2>Invite Code</h2>
    <div class="box">
      <input :placeholder="placeholder" readonly/>
      <i @click="shareCode" class="fe-share"></i>
    </div>
  </section>

</template>

<style scoped>

.invitecode-container {
  display: flex;
  flex-direction: column;
  gap: 1vh;
}

h2 {
  color: var(--primary-color);
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

.box {
  display: flex;
  gap: 1vw;
}

</style>