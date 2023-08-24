<template>
    <BooleanOperations operation="exclude" fill-color="green">
        <div class="container">
            <h1>boolean operations</h1>
            <h3>布尔运算</h3>
        </div>
    </BooleanOperations>
</template>

<script setup lang="ts">
import BooleanOperations from '@/components/booleanOperations/index.vue'
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    user-select: none;
}

h1 {
    text-transform: uppercase;
    user-select: none;
}
</style>