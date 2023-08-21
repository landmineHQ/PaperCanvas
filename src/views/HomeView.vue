<script setup lang="ts">
import CanvasCursor from "@/components/canvasCursor/CanvasCursor.vue"
import { ref } from "vue";
const showChain = ref(true)
</script>

<template>
  <CanvasCursor :show-chains="showChain">
    <div slot:default class="container">
      <h1>canvas cursor</h1>
      <label for="id_showChain" id="toggleLabel">
        <input type="checkbox" id="id_showChain" v-model="showChain"><em>toggle showChain</em>
      </label>
    </div>
  </CanvasCursor>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
}

h1 {
  text-align: center;
  text-transform: uppercase;
  user-select: none;
}

#toggleLabel {
  margin: 0 auto;
  user-select: none;
  cursor: none;
}
</style>