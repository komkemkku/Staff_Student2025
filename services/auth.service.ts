import type { Login } from "@/models/page.model"
import { client } from "./httpClient"
import type { StaffInfo } from "@/models/staff.model"

export const login = (payload: Login) => {
    return client({
        url: "/staff/login",
        method: "post",
        data: payload,
    })
}