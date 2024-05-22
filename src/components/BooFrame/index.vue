<template>
  <iframe v-loading="isLoading" style="width: 100%; height: 100%" frameborder="0" :src="props.src" @load="onload"></iframe>
</template>
<script setup lang="ts" name="BooFrame">
import { ref } from "vue";

const props = defineProps({
  src: String
});

// console.log("loading");
const isLoading = ref(true);

const onload = () => {
  isLoading.value = false;
  // console.log("load ok");
};
</script>
