<template>
  <div>
    <div>Hello world</div>
  </div>
</template>

<script lang="ts" setup>
import { useIndexStore } from "@/stores/main"

definePageMeta({
  middleware: "auth",
});

const store = useIndexStore();
</script>

<style></style>
