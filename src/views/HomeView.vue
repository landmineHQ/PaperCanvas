<script setup lang="ts">
import CanvasCursor from "@/components/canvasCursor/CanvasCursor.vue"
</script>

<template>
  <CanvasCursor>
    <div slot:default>
      <h1>hello world</h1>
    </div>
  </CanvasCursor>
</template>

<style lang="scss" scoped>
h1 {
  text-align: center;
  text-transform: uppercase;
  user-select: none;
}
</style>