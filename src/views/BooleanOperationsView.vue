<template>
    <BooleanOperations :operation="operation" :fill-color="color">
        <div class="bo-container">
            <h1>boolean operations</h1>
            <label class="select-opearation--box">
                <h3>布尔运算</h3>
                <select v-model="operation">
                    <option v-for="item in operations" :value="item">{{ item }}</option>
                </select>
            </label>
            <label>
                <h3>颜色选择器</h3>
                <input type="color" v-model="color">
            </label>
        </div>
    </BooleanOperations>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import BooleanOperations from '@/components/booleanOperations/index.vue'
import type { OperationsType } from '@/components/booleanOperations/interface/interface';
import paperFull from 'paper';
const operations = ['unite', 'intersect', 'subtract', 'exclude', 'divide', 'reorient']

const operation: Ref<OperationsType> = ref("exclude")
const color = ref(paperFull.Color.random().toCSS(true))
</script>

<style lang="scss" scoped>
.bo-container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    user-select: none;
    width: fit-content;
    height: fit-content;
    margin: 0 auto;
    gap: 8px;
}

h1 {
    text-transform: uppercase;
}

.select-opearation--box {

    select {
        width: 120px;
        height: calc(100% - 4px);
    }
}

h3 {
    display: inline;

    &::after {
        content: "：";
    }
}
</style>