<template>
  <div>
    <!-- ปุ่มย้อนกลับ -->
    <div class="flex justify-start mt-5 ml-5">
      <button @click="goBack" class="text-white bg-[#A73B24] opacity-80 px-3 py-1 rounded-lg shadow-xl">
        Back
      </button>
    </div>

    <div class="flex justify-center font-serif font-bold text-xl mt-5">
      <h1>Check-in</h1>
    </div>

    <!-- แสดง Loading -->
    <div v-if="loading" class="flex justify-center mt-10">
      <p>Loading data...</p>
    </div>

    <!-- แสดง Error -->
    <div v-else-if="error" class="flex justify-center mt-10 text-red-500">
      <p>{{ error }}</p>
    </div>

    <!-- แสดงข้อมูล Event และ User -->
    <div v-else-if="eventData && userData" class="flex justify-center">
      <div class="h-auto max-w-[700px] bg-white rounded-lg mt-5 p-5">
        <!-- ✅ รูปของ Event -->
        <img
          :src="eventData.image || 'https://shortrecap.co/wp-content/uploads/2020/05/Catcover_web.jpg'"
          class="w-full h-[200px] object-cover rounded-lg"
          alt="Event Image"
        />

        <h2 class="flex justify-center font-semibold text-2xl mt-5">
          {{ eventData.name }}
        </h2>

        <div>
          <p class="mt-10 font-bold">ข้อมูลนักศึกษา</p>
          <p class="mt-3"><b>ชื่อ-สกุล :</b> {{ userData.firstname }} {{ userData.lastname }}</p>
          <p class="mt-3"><b>ชื่อเล่น :</b> {{ userData.nickname }}</p>
          <p class="mt-3"><b>รหัสนักศึกษา :</b> {{ userData.student_id }}</p>
          <p class="mt-3"><b>อีเมล :</b> {{ userData.email }}</p>
          <p class="mt-3"><b>คณะ :</b> {{ userData.faculty }}</p>
          <p class="mt-3"><b>โรคประจำตัว :</b> {{ userData.medical_condition }}</p>
          <p class="mt-3"><b>อาหารที่แพ้ :</b> {{ userData.food_allergies }}</p>
        </div>

        <div class="flex justify-center mt-5">
          <button
            @click="saveCheckin"
            :disabled="loadingCheckin"
            class="font-semibold text-white bg-black w-40 h-10 rounded-3xl mt-5 drop-shadow-lg"
          >
            {{ loadingCheckin ? "Processing..." : "Check" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as api from "@/services/api.service";
import { useIndexStore } from "@/stores/main";
import Swal from "sweetalert2";

const route = useRoute();
const router = useRouter();
const authStore = useIndexStore();

const eventData = ref<any | null>(null);
const userData = ref<any | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const eventId = ref<number | null>(null);
const userId = ref<number | null>(null);
const staffId = ref<number | null>(null);
const loadingCheckin = ref(false); // Loading state for Check-in

definePageMeta({
  middleware: "auth",
});

// ✅ ฟังก์ชันย้อนกลับ
const goBack = () => {
  router.push("/events");
};

// ✅ โหลด staffId จาก Store หรือ LocalStorage
const loadStaffId = () => {
  const storedStaffId = localStorage.getItem("staff_id");
  staffId.value = storedStaffId ? Number(storedStaffId) : authStore.staffId;

  if (!staffId.value) {
    console.error("❌ Staff ID not found. Please login again.");
  } else {
    console.log("✅ Staff ID Loaded:", staffId.value);
  }
};

// ✅ โหลดข้อมูล Event และ User
const fetchData = async () => {
  try {
    loading.value = true;

    eventId.value = Number(route.query.event_id || route.params.event_id);
    userId.value = Number(route.query.user_id || route.params.user_id);

    if (!eventId.value || !userId.value) {
      throw new Error("❌ Invalid event_id or user_id");
    }

    console.log(`🔄 Fetching data for Event ID: ${eventId.value}, User ID: ${userId.value}`);

    // ดึงข้อมูล Event
    const eventResponse = await api.getEventsById(eventId.value);
    eventData.value = eventResponse.data.data;

    // ดึงข้อมูล User
    const userResponse = await api.getUserById(userId.value);
    userData.value = userResponse.data.data;

    console.log("✅ Data Loaded Successfully");
  } catch (err: any) {
    error.value = "Failed to load data. Please try again.";
    console.error("❌ Error fetching data:", err);
  } finally {
    loading.value = false;
  }
};

// ✅ ฟังก์ชันบันทึก Check-in
const saveCheckin = async () => {
  try {
    loadingCheckin.value = true;

    if (!userId.value || !eventId.value || !staffId.value) {
      throw new Error("❌ Missing user_id, event_id, or staff_id");
    }

    console.log(`📌 Sending Check-in Request:`, { user_id: userId.value, event_id: eventId.value, staff_id: staffId.value });

    const response = await api.checkIn(userId.value, eventId.value, staffId.value);
    console.log("✅ API Response:", response.data);

    if (response.data && response.data.message === "Check-in successful") {
      Swal.fire({
        title: "✅ Check-in Successful!",
        text: "บันทึกการเช็คชื่อสำเร็จ",
        icon: "success",
        confirmButtonText: "ตกลง",
      }).then(() => {
        router.push("/events");
      });
    } else {
      Swal.fire({
        title: "❌ Check-in Failed!",
        text: response.data.message || "เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  } catch (err) {
    Swal.fire({
      title: "❌ Check-in Error!",
      text: "เช็คชื่อไม่สำเร็จ กรุณาลองใหม่ หรือผู้ใช้ได้เช็คชื่อไปแล้ว",
      icon: "warning",
      confirmButtonText: "ตกลง",
    });
  } finally {
    loadingCheckin.value = false;
  }
};

onMounted(() => {
  loadStaffId();
  fetchData();
});

// ✅ อัปเดตข้อมูลเมื่อ Route เปลี่ยน
watch(
  () => [route.query.event_id, route.query.user_id],
  ([newEventId, newUserId], [oldEventId, oldUserId]) => {
    if (newEventId !== oldEventId || newUserId !== oldUserId) {
      fetchData();
    }
  }
);
</script>

<style></style>
