import { STORAGE_PATHS } from "@/constants/application";
import createPersistedState from "vuex-persistedstate";

export default createPersistedState({
  paths: STORAGE_PATHS,
  storage: window.sessionStorage,
});
