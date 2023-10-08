import { defineStore } from "pinia";
import { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";

export const useUserStore = defineStore({
  id: "geeker-user",
  state: (): UserState => ({
    isLogined: false,
    userInfo: { id: 0, name: "Geeker", nickname: "Geeker Admin" }
  }),
  getters: {},
  actions: {
    // Set Token
    logout() {
      this.isLogined = false;
    },
    // Set setUserInfo
    setUserInfo(u: UserState) {
      this.isLogined = u.isLogined;
      this.userInfo = u.userInfo;
    }
  },
  persist: piniaPersistConfig("geeker-user")
});
