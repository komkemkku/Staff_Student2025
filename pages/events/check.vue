<template>
  <div>
    <div class="flex justify-start mt-5 ml-5">
      <button
        @click="goBack"
        class="text-white bg-[#A73B24] opacity-80 px-1 py-1 rounded-lg shadow-xl"
      >
        Back
      </button>
    </div>
    <div class="flex justify-center font-serif font-bold text-xl mt-5">
      <h1>Check-in</h1>
    </div>

    <div v-if="loading" class="flex justify-center mt-10">
      <p>Loading data...</p>
    </div>

    <div v-else-if="error" class="flex justify-center mt-10 text-red-500">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="eventData && userData" class="flex justify-center">
      <div
        class="h-auto max-sm:h-auto max-lg:w-[700px] max-sm:w-[350px] bg-gray-300 rounded-lg mt-5 p-5"
      >
        <!-- ✅ รูปของ Event -->
        <img
          :src="
            eventData.image ||
            'https://shortrecap.co/wp-content/uploads/2020/05/Catcover_web.jpg'
          "
          class="w-full h-[200px] object-cover rounded-lg"
          alt="Event Image"
        />

        <h2 class="flex justify-center font-semibold text-2xl mt-5">
          {{ eventData.name }}
        </h2>

        <div>
          <p class="mt-10 font-bold">ข้อมูลนักศึกษา</p>
          <p class="mt-3">
            <b>ชื่อ-สกุล :</b> {{ userData.firstname }} {{ userData.lastname }}
          </p>
          <p class="mt-3"><b>ชื่อเล่น :</b> {{ userData.nickname }}</p>
          <p class="mt-3"><b>รหัสนักศึกษา :</b> {{ userData.student_id }}</p>
          <p class="mt-3"><b>อีเมล :</b> {{ userData.email }}</p>
          <p class="mt-3"><b>คณะ :</b> {{ userData.faculty }}</p>
          <p class="mt-3">
            <b>โรคประจำตัว :</b> {{ userData.medical_condition }}
          </p>
          <p class="mt-3"><b>อาหารที่แพ้ :</b> {{ userData.food_allergy }}</p>
        </div>

        <div class="flex justify-center mt-5">
          <button
            @click="saveCheckin"
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
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as api from "@/services/api.service";
import { useIndexStore } from "@/stores/main";

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

const goBack = () => {
  router.push("/events");
};

const loadStaffId = () => {
  const storedStaffId = localStorage.getItem("staff_id");
  const parsedStaffId = storedStaffId ? Number(storedStaffId) : null;

  staffId.value = authStore.staffId || parsedStaffId;

  if (!staffId.value) {
    console.error("Staff ID not found. Please login again.");
  }
};

// ✅ โหลดข้อมูล Event และ User
const fetchData = async () => {
  try {
    loading.value = true;

    // ✅ แปลงค่า route.params ให้เป็น number
    eventId.value = Number(route.params.event_id);
    userId.value = Number(route.params.user_id);

    if (!eventId.value || !userId.value) {
      throw new Error("Invalid event_id or user_id");
    }

    // ✅ ดึงข้อมูล Event
    const eventResponse = await api.getEventsById(eventId.value);
    eventData.value = eventResponse.data.data;

    // ✅ ดึงข้อมูล User
    const userResponse = await api.getUserById(userId.value);
    userData.value = userResponse.data.data;
  } catch (err: any) {
    error.value = "Failed to load data. Please try again.";
    console.error("Error fetching data:", err);
  } finally {
    loading.value = false;
  }
};

const saveCheckin = async () => {
  try {
    if (!userId.value || !eventId.value || !staffId.value) {
      throw new Error("Missing user_id, event_id, or staff_id");
    }

    const response = await api.checkIn(
      userId.value,
      eventId.value,
      staffId.value
    );

    if (response.data.success) {
      alert("Check-in successful!");
      router.push("/events");
    } else {
      throw new Error("Check-in failed");
    }
  } catch (err) {
    console.error("Failed to save check-in:", err);
    alert("Check-in failed. Please try again.");
  }
};

onMounted(() => {
  loadStaffId();
  fetchData();
});
</script>

<style></style>
