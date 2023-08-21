<template>
  <div class="about">
    <h1>hello {{ _packageJson.name }} &lsaquo;{{ _packageJson.version }}&rsaquo;</h1>
    <h3>this page will teach you how to start with {{ _packageJson.name }}.</h3>
  </div>
</template>

<script setup lang="ts">
import _packageJson from '#/package.json'
</script>

<style lang="scss" scoped>
h1 {
  text-transform: capitalize;
  text-align: center;
}

h3 {
  text-align: center;
}
</style>
