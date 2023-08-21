<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import router, { routes } from "@/router"
import { watch } from 'vue';
import paperFull from 'paper';
console.clear()

watch(router.currentRoute, () => {
  document.title = router.currentRoute.value.name?.toString().toUpperCase() as string
}, {
  deep: true,
})
</script>

<template>
  <header>
    <nav>
      <RouterLink v-for="(item) in routes" :to="item.path">{{ item.name }}</RouterLink>
    </nav>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
@import url("./assets/scss/App.scss");
@import url("./assets/scss/response/App.scss");
</style>
