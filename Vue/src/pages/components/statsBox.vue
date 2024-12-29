<script setup>
import { notification } from "@/assets/js/notificationEvent.js";
</script>

<script>
export default {
  props: {
    number: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      required: true
    }
  }
}
</script>

<template>
<section class="statsbox-container">
  <h3><slot></slot></h3>
  <div class="box">
    <div class="icon">
      <i :class="`fe-${type}`"></i>
    </div>
    <span>{{ number }}</span>
  </div>
</section>
</template>

<style scoped>
.box {
  display: flex;
  align-items: center;
  gap: 5px;
}

.icon,
span {
  font-size: 1.25rem;
  border: 4px solid var(--primary-color);
  border-radius: 15px 0 0 15px;
}
.icon {
  padding: 10px;
  background-color: var(--primary-color);
}
i {
  color: var(--secondary-color);
}
span {
  padding: 10px;
  background-color: var(--white-color);
  border-radius: 0 15px 15px 0;
  width: 20vw;
}
</style>