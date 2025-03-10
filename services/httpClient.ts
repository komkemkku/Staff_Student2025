// เรียนใช้ axios

import axios from "axios";
import type { Option } from "@/models/client.model";

    export const client = (ops: Option) => {
        const config: any = useRuntimeConfig()

        let api: any = axios.create()

        api.defaults.baseURL = config.public.BASE_URL
        api.defaults.headers.common['Content-Type'] = 'application/json'
        api.defaults.headers.common['ngrok-skip-browser-warning'] = 'true'

        // ตรวจสอบ Token
        api.interceptors.request.use(
            async function (config: any) {
                let token = await useCookie('token')
                config.headers['Authorization'] = 'Bearer ' + token.value
                return config
            },
                    // ถ้าเกิดerror
        function(error: any){
            // console.log
        }
        )

        api.defaults.validaStatus = false
        ops.method = ops.method.toLowerCase()

        return api({
            ...ops,
        })



    }