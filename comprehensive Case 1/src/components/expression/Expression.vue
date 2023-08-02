<template>
  <div class="expression-container">
    <p>hello world</p>
    <p @click="t1">Canvas鼠标</p>
  </div>
</template>

<script setup lang="ts">
function t1() {
  console.log(arguments)
}
</script>

<style lang="scss" scoped>
@import url('./css/main.scss');
</style>
