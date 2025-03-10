import { useIndexStore } from "@/stores/main";
import * as service from "@/services/api.service";

const store = useIndexStore();

export const verify = async () => {
    await service.getStaffInfo()
    .then((resp: any) => {
      const data = resp.data.data;
      console.log(data)
      store.$state.staffId = data.id;
      store.$state.token = data.token;
    })
    .catch((error: any) => {
       console.error(error);
     })
     .finally(() => {});
}
