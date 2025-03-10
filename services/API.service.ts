import { client } from "./httpClient";
import type { EventGetId } from "@/models/event.model";

export const getStaffInfo = () => {
  return client({
    url: "/staff/info",
    method: "get",
  });
};

export const getEvents = () => {
  return client({
    url: "/event/list",
    method: "get",
  });
};

export const getEventsById = (id: number | string, query?: EventGetId) => {
  return client({
    url: `/event/${id}`,
    method: "get",
    params: query || {},
  });
};

export const getUserById = (user_id: number) => {
  return client({
    url: `/user/${user_id}`,
    method: "get",
  });
};

export const checkIn = (user_id: number, event_id: number, staff_id: number) => {
  return client({
    url: `/checkin/create`,
    method: "post",
    data: {
      user_id: user_id,
      event_id: event_id,
      staff_id: staff_id,
    },
  });
};