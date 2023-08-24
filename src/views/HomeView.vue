<script setup lang="ts">
import CanvasCursor from "@/components/canvasCursor/index.vue"
import { reactive, ref } from "vue";
const showChain = ref(true)
const chainOptions = reactive({
  points: 45,
  length: 25,
})
</script>

<template>
  <CanvasCursor :show-chains="showChain" :chain-options="chainOptions">
    <div slot:default class="container">
      <h1>canvas cursor</h1>
      <div class="toggle--container">
        <label>
          <input type="checkbox" id="id_showChain" v-model="showChain"><em>toggle showChain</em>
        </label>
      </div>

      <div class="input--container">
        <label>
          <span>骨架节点数：</span>
          <input type="text" id="id_skeletonNodeNumber" v-model="chainOptions.points">
        </label>
        <label>
          <span>节点长度：</span>
          <input type="text" id="id_nodeLength" v-model="chainOptions.length">
        </label>
      </div>
    </div>
  </CanvasCursor>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

h1 {
  text-align: center;
  text-transform: uppercase;
  user-select: none;
}

label {
  user-select: none;
  cursor: none;
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
  justify-content: center;
}

.input--container {
  label {
    span {
      width: 100px;
      text-align: right;
    }

    input[type="text"] {
      width: 100px;
    }
  }
}
</style>