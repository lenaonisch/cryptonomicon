import { createRouter, createWebHistory } from "vue-router";
import MainPage from "./pages/MainPage.vue";
import SimpleAdvertPage from "./pages/SimpleAdvertPage.vue";

const routes = [
  { path: "/simpleAdvert", component: SimpleAdvertPage },
  { path: "/", component: MainPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
