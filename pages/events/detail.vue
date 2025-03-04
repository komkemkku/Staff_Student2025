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
          <p class="text-xl mt-10">พิธีบายศรีสู่ขวัญ</p>
          <p class="mt-3">รายละเอียดงาน : </p>
          <p class="mt-3">สถานที่ : </p>
          <p class="mt-3">เวลา : </p>
          <p class="mt-3">การแต่งกาย : </p>
        </div>
        <div class="flex justify-center mt-5">
          <button
            @click="scanButton"
            class="font-semibold text-white bg-black w-40 h-10 rounded-3xl mt-14 drop-shadow-lg"
          >
            Scan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
