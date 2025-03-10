<template>
  <div>
    <div class="flex justify-center w=[393px] h=[852px]">
      <!-- Content -->
      <div
        class="flex justify-center w-[550px] max-lg:w-[550px] max-sm:w-[350px] border border-gray-300 rounded-2xl shadow-2xl mt-10"
      >
        <div class="flex justify-center">
          <div class="font-serif font-bold text-2xl mt-10">
            <h1 class="flex justify-center">Login</h1>

            <div class="font-normal" @submit.prevent="login">
              <!-- Login form -->
              <p class="text-sm mt-10">Username :</p>
              <input
                type="text"
                id="username"
                v-model="logins.username"
                class="font-normal text-sm w-80 p-4 bg-gray-200 border border-gray-300 rounded-3xl mt-3 drop-shadow-lg"
                required
                placeholder="username"
                @keyup.enter="login"
              />

              <p class="text-sm mt-10">Password :</p>
              <input
                type="password"
                id="password"
                v-model="logins.password"
                class="font-normal text-sm w-80 p-4 bg-gray-200 border border-gray-300 rounded-3xl mt-3 drop-shadow-lg"
                required
                placeholder="password"
                @keyup.enter="login"
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
          <Loading :loading="loading" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { useIndexStore } from "@/stores/main";
import type { Login } from "@/models/page.model";
import * as auth from "@/services/auth.service";
import * as api from "@/services/api.service";
import { ref } from "vue";
// import { useCookie } from "#app";

definePageMeta({
  middleware: "auth",
});

definePageMeta({
  layout: "default",
});

const router = useRouter();
const store = useIndexStore();
const loading = ref(false);

const logins = ref<Login>({
  username: "",
  password: "",
});

const login = async () => {
  loading.value = true;
  try {
    const resp = await auth.login(logins.value);

    // เก็บ Token ลง Cookie
    const token = useCookie("token");
    token.value = resp.data.token;

    console.log(resp.data);
    store.$state.token = resp.data.token;

    // ดึงข้อมูลผู้ใช้
    await getstaffinfo();

    // ถ้าล็อกอินสำเร็จ ให้ redirect ไปหน้าแรก
    if (store.$state.token) {
      router.push("/events/");
    }
  } catch (error) {
    console.error(error);
    Swal.fire({
      title: "เกิดข้อผิดพลาด!",
      text: "ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง.",
      icon: "error",
      confirmButtonText: "ตกลง",
    });
  } finally {
    loading.value = false;
  }
};

const getstaffinfo = async () => {
  try {
    const resp = await api.getStaffInfo();
    const data = resp.data.data;
    console.log(data);
    store.$state.staffId = data.id;
  } catch (error) {
    console.error(error);
  }
};
</script>

<style></style>
