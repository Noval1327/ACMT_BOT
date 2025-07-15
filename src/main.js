import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import Layout from "./components/Layout.vue";
import Dashboard from "./components/Dashboard.vue";
import "flowbite";

import { createRouter, createWebHistory } from "vue-router";
import ChatSection from "./components/ChatSection.vue";

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

createApp(App).use(router).mount("#app");
