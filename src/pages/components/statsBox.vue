<script>
export default {
  props: {
    number: {
      type: Uint32Array,
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
  <box>
    <div>
      <i :class="`fe-${type}`"></i>
    </div>
    <span>{{ number }}</span>
  </box>
</section>
</template>

<style scoped>
box {
  display: flex;
  align-items: center;
  gap: 5px;
}

div,
span {
  font-size: 1.25rem;
  border: 4px solid var(--primary-color);
  border-radius: 15px 0 0 15px;
}
div {
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