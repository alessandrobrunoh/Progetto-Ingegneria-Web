<template>
  <div>
    <input v-bind:value="inputValue" @input="updateValue" />
    <p>Input value: {{ inputValue }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputValue: 'Initial value'
    };
  },
  methods: {
    updateValue(event) {
      this.inputValue = event.target.value;
    }
  }
};
</script>

<style scoped>
input {
  margin-bottom: 10px;
}
</style>