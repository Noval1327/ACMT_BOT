import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "flowbite";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Dashboard from "./layout/Dashboard.vue";
import { createRouter, createWebHistory } from "vue-router";
import ChatSection from "./components/ChatSection.vue";
import { createPinia } from "pinia";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/Dashboard",
      component: Dashboard,
    },
    {
      path: "/Nura/Chat",
      component: ChatSection,
    },
  ],
});

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
createApp(App).use(router).mount("#app");
