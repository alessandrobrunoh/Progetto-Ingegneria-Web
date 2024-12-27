<script setup>
</script>

<template>
    <select class="box">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
    </select>
</template>

<style scoped>
.box {
  display: flex;
  gap: 10px;
  padding: 15px;
  border: 4px solid var(--success-color);
  border-radius: 15px;
  flex-direction: row;
  width: 60vw;
  background-color: var(--white-color);
  box-shadow: 0 4px 4px rgb(0 0 0 / 25%); 
} 
</style>