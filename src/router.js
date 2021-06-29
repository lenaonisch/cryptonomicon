import { createRouter, createWebHistory } from "vue-router";
import MainPage from "./pages/MainPage.vue";
import SimpleAdvertPage from "./pages/SimpleAdvertPage.vue";
import CoinDetails from "./components/CoinDetails.vue";

const routes = [
  { path: "/simpleAdvert", component: SimpleAdvertPage },
  { path: "/", component: MainPage },
  { name: "coinDetails", path: "/coin/:name", component: CoinDetails },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
