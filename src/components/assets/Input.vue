<script>
export default {
  name: "Input",
  props: {
    modelValue: {
      type: String,
      required: true
    },
    type: {
      type: String
    },
    placeholder: {
      type: String
    }
  },
  emits: ['update:modelValue']
}
</script>

<template>
  <box>
    <i :class="`fe-${type}`"></i>
    <input :type="type" :placeholder="placeholder" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
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
  border: 4px solid var(--success-color);
  border-radius: 15px;
  font-size: 1.25rem;
  width: 60vw;
  background-color: var(--white-color);
  box-shadow: 0 4px 4px rgb(0 0 0 / 25%);
}
</style>