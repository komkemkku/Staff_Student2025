<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { useCookie } from "#app";
import { onMounted, onUnmounted } from "vue";

const INACTIVE_TIME = 5 * 60 * 1000; // 5 นาที
let timeout;

const resetTimer = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    const token = useCookie("token");
    token.value = null; // ลบ Token ออกจาก Cookie
    console.log("Token ถูกลบเนื่องจากไม่มีการใช้งานเกิน 5 นาที");
  }, INACTIVE_TIME);
};

const startInactivityTimer = () => {
  window.addEventListener("mousemove", resetTimer);
  window.addEventListener("keydown", resetTimer);
  resetTimer();
};

onMounted(() => {
  startInactivityTimer();
});

onUnmounted(() => {
  window.removeEventListener("mousemove", resetTimer);
  window.removeEventListener("keydown", resetTimer);
});
</script>
