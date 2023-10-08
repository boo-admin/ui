<template>
  <div class="footer flx-center">
    <a href="#" target="_blank">{{ footTitle }}</a>
  </div>
</template>

<script setup lang="ts">
const footTitle = (window as any).footTitle;
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
