<template>
  <HwFrame :src="frameSrc"></HwFrame>
</template>
<script setup lang="ts" name="customWrapIn">
import { ref } from "vue";
import HwFrame from "@/components/HwFrame/index.vue";
import { useRoute } from "vue-router";

const props = defineProps(["src"]);
const route = useRoute();

let paramSrc: string | null = props.src;
if (props.src) {
  paramSrc = props.src;
} else if (route.params.src) {
  if (Array.isArray(route.params.src)) {
    paramSrc = route.params.src[0];
  } else {
    paramSrc = route.params.src as string;
  }
} else if (route.query.src) {
  if (Array.isArray(route.query.src)) {
    paramSrc = route.query.src[0];
  } else {
    paramSrc = route.query.src;
  }
}

const frameSrc = ref("");
if (paramSrc) {
  if (!paramSrc.includes("no_layout=true")) {
    if (paramSrc.includes("?")) {
      paramSrc = paramSrc + "&no_layout=true";
    } else {
      paramSrc = paramSrc + "?no_layout=true";
    }
  }

  if (paramSrc.startsWith("@/")) {
    frameSrc.value = (window as any).basePathWithoutSlash + paramSrc.slice("@".length);
  } else {
    frameSrc.value = paramSrc;
  }
}
</script>
