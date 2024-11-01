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
  <button :color="color">
    <slot></slot>
  </button>
</template>

<style scoped>
button {
  padding: 15px;
  border: 0 solid;
  border-radius: 15px;
  width: 70vw;
  font-size: 1.5rem;
  color: var(--secondary-color);
  background-color: var(--primary-color);
  cursor: pointer;
  box-shadow: 0 4px 4px rgb(0 0 0 / 25%);
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
</style>