<template>
  <div>
    <div class="flex justify-center font-serif font-bold text-xl mt-5">
      <h1>Event</h1>
    </div>
    <div class="flex justify-center">
      <div class="h-[150px] max-sm:h-[100px] max-lg:w-[700px] max-sm:w-[350px] bg-gray-300 rounded-lg mt-5">
        <img
          src="public\images\ev2.png"
          class="w-full h-full object-cover rounded-lg"
        />
        <h2 class="flex justify-center font-semibold text-2xl mt-10">
          พิธีบายศรีสู่ขวัญ
        </h2>
        <div>
          <p class="mt-10">ข้อมูลนักศึกษา</p>
          <p class="mt-3">ชื่อ-สกุล : </p>
          <p class="mt-3">ชื่อเล่น : </p>
          <p class="mt-3">รหัสนักศึกษา : </p>
          <p class="mt-3">อีเมล : </p>
          <p class="mt-3">คณะ : </p>
          <p class="mt-3">โรคประจำตัว : </p>
          <p class="mt-3">อาหารที่แพ้ : </p>
        </div>
        <div class="flex justify-center mt-5">
          <button
            @click="scanButton"
            class="font-semibold text-white bg-black w-40 h-10 rounded-3xl mt-5 drop-shadow-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style>

</style>