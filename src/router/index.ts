import { ROUTE } from "@/constants/application";
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import HomeTop from "../views/HomeTop.vue";

const { HOME, INPUT_TOP, INPUT_INPUT, INPUT_END, INPUT_MODIFY } = ROUTE;

const routes: Array<RouteRecordRaw> = [
  {
    path: HOME,
    component: HomeTop,
  },
  {
    path: INPUT_TOP,
    component: () =>
      import(/* webpackChunkName: "input" */ "../views/InputTop.vue"),
  },
  {
    path: INPUT_INPUT,
    component: () =>
      import(/* webpackChunkName: "input" */ "../views/InputInput.vue"),
  },
  {
    path: INPUT_END,
    component: () =>
      import(/* webpackChunkName: "input" */ "../views/InputEnd.vue"),
  },
  {
    path: INPUT_MODIFY,
    component: () =>
      import(/* webpackChunkName: "input" */ "../views/InputModify.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
