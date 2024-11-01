<script>
export default {
  name: "input",
  props: {
    type: {
      type: String
    },
    placeholder: {
      type: String
    }
  }
}
</script>

<template>
  <box>
    <i :class="`fe-${type}`"></i>
    <input :type="type" :placeholder="placeholder"/>
  </box>
</template>

<style scoped>
i {
  font-size: 1.5rem;
  color: var(--success-color);
}

input {
  border: 0;
}

input:focus,
input:active {
  outline: none;
}

box {
  display: flex;
  gap: 10px;
  padding: 15px;
  border: 3.5px solid var(--success-color);
  border-radius: 15px;
  font-size: 1.25rem;
  width: 60vw;
  background-color: var(--white-color);
  box-shadow: 0 4px 4px rgb(0 0 0 / 25%);
}
</style>