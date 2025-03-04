<template>
  <div>
    <div class="flex justify-center w=[393px] h=[852px]">
      <!-- Content -->
      <div class="flex justify-center w-[550px] max-lg:w-[550px] max-sm:w-[350px] border border-gray-300 rounded-2xl shadow-2xl mt-10">
        <div class="flex justify-center">
          <div class="font-serif font-bold text-2xl mt-10">
            <h1 class="flex justify-center">Login</h1>

            <div class="font-normal">
              <!-- Login form -->
              <p class="text-sm mt-10">Username :</p>
              <input
                type="text"
                class="font-normal text-sm w-80 p-4 bg-gray-200 border border-gray-300 rounded-3xl mt-3 drop-shadow-lg"
                placeholder="username"
              />
              <p class="text-sm mt-10">Password :</p>
              <input
                type="password"
                class="font-normal text-sm w-80 p-4 bg-gray-200 border border-gray-300 rounded-3xl mt-3 drop-shadow-lg"
                placeholder="password"
              />
            </div>
            <div class="flex justify-center mt-10">
              <button
                @click="login"
                class="font-serif font-semibold text-white bg-black w-40 h-10 rounded-3xl mt-20 drop-shadow-lg mb-10"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
