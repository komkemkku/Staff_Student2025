import { client } from "./httpClient"

export const getStaffInfo = () => {
    return client({
        url: "/staff/info",
        method: "get",
    })
}

export const getEvents = () => {
    return client({
      url: "/event/list",
      method: "get",
    });
  };