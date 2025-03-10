export default defineNuxtRouteMiddleware(async (to, from) => {
    const refToken = useCookie("token"); // ใช้ useCookie แทน useStatefulCookie
  
    // ถ้าไม่มี Token ให้เด้งไปหน้า Login
    if (!refToken.value) {
      return navigateTo("/login");
    }
  
    // ถ้าเป็นการ Refresh หน้าเดิม ไม่ต้องทำอะไรเพิ่ม แค่เรียก verify()
    if (to.fullPath === from.fullPath) {
      return await verify();
    }
  });
  