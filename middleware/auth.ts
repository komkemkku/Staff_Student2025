export default defineNuxtRouteMiddleware(async(to, from) => {
    // เช็คหน้า ถ้า refresh แล้ว = หน้าเดิม
    if (to.fullPath === from.fullPath){
        return await verify()
    }
    const refToken = useStatefulCookie(`token`)
    if (!refToken.value){
        return navigateTo(`/`)
    }

})
