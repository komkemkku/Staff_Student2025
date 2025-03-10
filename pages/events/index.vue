<template>
  <div>
    <div class="flex justify-center font-serif font-bold text-xl mt-5">
      <h1>Events</h1>
    </div>

    <!-- แสดง Loading -->
    <div v-if="loading" class="flex justify-center mt-10">
      <p>Loading events...</p>
    </div>

    <!-- แสดง Error ถ้ามี -->
    <div v-if="error" class="flex justify-center mt-10 text-red-500">
      <p>{{ error }}</p>
    </div>

    <!-- แสดงรายการ Events -->
    <div v-if="events.length > 0" class="overflow-y-auto h-[600px] mt-5">
      <div v-for="event in events" :key="event.id" class="flex justify-center">
        <div
          class="h-[150px] max-lg:w-[700px] max-sm:w-[350px] bg-gray-300 rounded-lg mt-5"
        >
          <img
            :src="event.image || event.imageUrl || 'https://shortrecap.co/wp-content/uploads/2020/05/Catcover_web.jpg'"
            class="w-full h-full object-cover rounded-lg cursor-pointer"
            alt="Event Image"
            @click="goToEvent(event.id)"
          />
        </div>
      </div>
    </div>

    <!-- กรณีไม่มีข้อมูล -->
    <div v-else-if="!loading && !error" class="flex justify-center mt-10">
      <p>No events found.</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import * as api from "@/services/api.service";
import { useIndexStore } from "@/stores/main";

definePageMeta({
  middleware: "auth",
});

const store = useIndexStore();
const router = useRouter(); 

const events = ref<Array<{ id: number; image?: string; imageUrl?: string }>>([]);
const loading = ref(true);
const error = ref<string | null>(null);


const goToEvent = (id: number) => {
  router.push(`/events/${id}`);
};

const fetchEvents = async () => {
  try {
    const response = await api.getEvents();
    if (response.data && Array.isArray(response.data.data)) {
      events.value = response.data.data;
    } else {
      error.value = "Invalid data format from API.";
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || "Failed to load events.";
    console.error("Error fetching events:", err);
  } finally {
    loading.value = false;
  }
};

// โหลดข้อมูลเมื่อ Component ถูก Mounted
onMounted(() => {
  fetchEvents();
});
</script>

<style></style>
