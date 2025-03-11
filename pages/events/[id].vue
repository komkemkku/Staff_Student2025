<template>
  <div>
    <div class="flex justify-start mt-5 ml-5">
      <button
        @click="goBack"
        class="text-white bg-[#A73B24] opacity-80 px-3 py-1 rounded-lg shadow-xl"
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
      <div class="h-auto max-w-[700px] bg-white rounded-lg mt-5 p-5">
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
          <p class="mt-10 font-bold">
            <b>รายละเอียดงาน :</b> {{ eventData.description }}
          </p>
          <p class="mt-3"><b>สถานที่ :</b> {{ eventData.location }}</p>
          <p class="mt-3"><b>การแต่งกาย :</b> {{ eventData.dress }}</p>
          <p class="mt-3">
            <b>เวลา :</b> {{ eventData.start_time }} - {{ eventData.end_time }}
          </p>
          <p class="mt-3">
            <b>วันที่ :</b> {{ eventData.start_date }} -
            {{ eventData.end_date }}
          </p>
        </div>
        <div class="flex justify-center mt-10">
          <button
            @click="openScanner"
            class="font-semibold text-white bg-black w-40 h-10 rounded-3xl drop-shadow-lg"
          >
            Scan
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ กล้อง QR Code -->
    <div
      v-if="showScanner"
      class="fixed inset-0 flex items-center justify-center"
      style="backdrop-filter: blur(10px)"
    >
      <div class="bg-white p-12 rounded-lg shadow-xl">
        <h2 class="text-lg font-semibold text-center">Scan QR Code</h2>

        <div id="reader" class="w-full mt-4"></div>
        <!-- กล้องจะถูกผูกไว้ที่นี่ -->

        <div class="flex justify-center mt-28">
          <button
            @click="stopScanner"
            class="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as api from "@/services/api.service";
import type { EventGetId } from "@/models/event.model";
import { Html5Qrcode } from "html5-qrcode";

const route = useRoute();
const router = useRouter();
const eventData = ref<EventGetId | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const showScanner = ref(false);
let scanner: Html5Qrcode | null = null;

definePageMeta({
  middleware: "auth",
});

// ✅ ดึงข้อมูล Event
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

  setTimeout(() => {
    if (!scanner) {
      scanner = new Html5Qrcode("reader");
    }

    const config = { fps: 10, qrbox: { width: 400, height: 400 } };

    scanner.start(
      { facingMode: "environment" },
      config,
      onScanSuccess,
      onScanError
    );
  }, 500);
};

// ปิดกล้อง QR Code
const stopScanner = () => {
  if (scanner) {
    scanner
      .stop()
      .then(() => {
        console.log("✅ Scanner stopped");
        showScanner.value = false;
      })
      .catch((err) => {
        console.error("❌ Failed to stop scanner:", err);
      });
  } else {
    showScanner.value = false;
  }
};

// ฟังก์ชันเมื่อสแกนสำเร็จ
const onScanSuccess = (decodedText: string) => {
  console.log("✅ Scanned QR Code:", decodedText);
  stopScanner();

  try {
    const qrData = JSON.parse(decodedText);
    if (qrData.user_id && qrData.event_id) {
      console.log("✅ Redirecting to checkIn page...");
      router.push({
        path: "/events/checkIn",
        query: { user_id: qrData.user_id, event_id: qrData.event_id },
      });
    } else {
      alert("QR Code ไม่ถูกต้อง กรุณาลองใหม่!");
    }
  } catch (error) {
    console.error("❌ Error parsing QR Code:", error);
    alert("QR Code ไม่ถูกต้อง กรุณาลองใหม่!");
  }
};

const onScanError = (error: any) => {
  console.error("❌ Scan Error:", error);
};

onUnmounted(() => {
  stopScanner();
});
</script>

<style>
#reader {
  width: 250px;
  height: 250px;
}
</style>
