import createPersistedState from "vuex-persistedstate";

export default createPersistedState({
  paths: ["survey", "status", "messages", "images", "data", "page", "common"],
  storage: window.sessionStorage,
});
