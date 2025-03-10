<template>
  <div>
    <div class="flex justify-start mt-5 ml-5">
      <button
        @click="goBack"
        class=" text-white bg-[#A73B24] opacity-80 px-1 py-1 rounded-lg shadow-xl"
      >
      Back
      </button>
    </div>
    <div v-if="loading" class="flex justify-center mt-10">
      <p>Loading event data...</p>
    </div>

    <div v-else-if="error" class="flex justify-center mt-10 text-red-500">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="eventData" class="flex justify-center">
      <div
        class="h-[150px] max-sm:h-[100px] max-lg:w-[700px] max-sm:w-[350px] bg-gray-300 rounded-lg mt-5"
      >
        <img
          :src="
            eventData.image ||
            'https://shortrecap.co/wp-content/uploads/2020/05/Catcover_web.jpg'
          "
          class="w-full h-full object-cover rounded-lg"
          alt="Event Image"
        />
        <h2 class="flex justify-center font-semibold text-2xl mt-10">
          {{ eventData.name }}
        </h2>
        <div>
          <p class="mt-10">
            <b>รายละเอียดงาน :</b> {{ eventData.description }}
          </p>
          <p class="mt-3"><b>สถานที่ : </b>{{ eventData.location }}</p>
          <p class="mt-3"><b>การแต่งกาย : </b>{{ eventData.dress }}</p>
          <p class="mt-3">
            <b>เวลา : </b>{{ eventData.start_time }} - {{ eventData.end_time }}
          </p>
          <p class="mt-3">
            <b>วันที่ : </b>{{ eventData.start_date }} -
            {{ eventData.end_date }}
          </p>
        </div>
        <div class="flex justify-center mt-10">
          <button
            @click="openScanner"
            class="font-semibold text-white bg-black w-40 h-10 rounded-3xl mt-14 drop-shadow-lg"
          >
            Scan
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ Popup กล้อง QR Code -->
    <div
      v-if="showScanner"
      class="fixed inset-0 flex items-center justify-center"
      style="backdrop-filter: blur(10px)"
    >
      <div class="bg-white p-5 rounded-lg shadow-xl">
        <h2 class="text-lg font-semibold text-center">Scan QR Code</h2>

        <client-only>
          <qrcode-stream @decode="onDecode" @init="onInit"></qrcode-stream>
        </client-only>

        <div class="flex justify-center mt-3">
          <button
            @click="closeScanner"
            class="font-semibold text-white bg-red-500 w-40 h-10 rounded-3xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { QrcodeStream } from "vue-qrcode-reader";
import * as api from "@/services/api.service";
import type { EventGetId } from "@/models/event.model";

const route = useRoute();
const router = useRouter();
const eventData = ref<EventGetId | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const showScanner = ref(false);

definePageMeta({
  middleware: "auth",
});

const fetchEventData = async () => {
  try {
    loading.value = true;
    error.value = null;
    const eventId = Number(route.params.id);

    if (!eventId) {
      error.value = "Invalid event ID.";
      return;
    }

    console.log("Fetching data for event ID:", eventId);

    const response = await api.getEventsById(eventId);
    eventData.value = response.data.data;
  } catch (err) {
    error.value = "Failed to load event data.";
    console.error("Error fetching event:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchEventData);

watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      eventData.value = null;
      fetchEventData();
    }
  },
  { immediate: true }
);

const goBack = () => {
  router.push("/events"); 
};

// ✅ เปิดกล้อง QR Code
const openScanner = () => {
  showScanner.value = true;
};

// ✅ ปิดกล้อง QR Code
const closeScanner = () => {
  showScanner.value = false;
};

const onDecode = (decodedString: string) => {
  console.log("Scanned QR Code:", decodedString);

  try {
    const qrData = JSON.parse(decodedString);
    if (qrData.user_id && qrData.event_id) {
      router.push(
        `/check?user_id=${qrData.user_id}&event_id=${qrData.event_id}`
      );
    } else {
      alert("QR Code ไม่ถูกต้อง กรุณาลองใหม่!");
    }
  } catch (error) {
    console.error("Error parsing QR Code:", error);
    alert("QR Code ไม่ถูกต้อง กรุณาลองใหม่!");
  }
};

const onInit = async (promise: Promise<any>) => {
  try {
    await promise;
    console.log("Camera initialized successfully");
  } catch (error) {
    console.error("Camera failed to initialize", error);
  }
};

onMounted(() => {
  fetchEventData();
});
</script>

<style>
.qrcode-stream {
  width: 300px;
  height: 300px;
}
</style>
