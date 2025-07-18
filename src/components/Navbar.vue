<template>
  <div
    @mouseover="hoverSidebar"
    @mouseleave="resetSidebar"
    id="sidebar"
    :class="[
      'shadow-lg p-4 space-y-6 h-full rounded-3xl bg-[#FFFFFC] transition-all duration-700 ease-in-out',
      isExpanded ? 'w-20' : 'w-60'
    ]"
  >
    <!-- Logo -->
    <div class="flex gap-x-2 h-fit items-center">
      <img
        :src="isExpanded ? logoPln : logoIconPlus"
        class="h-9 cursor-pointer mt-2"
        alt="Logo"
      />
    </div>

    <!-- Obrolan Baru -->
    <div>
      <div class="flex gap-x-2 items-center">
        <img src="./../assets/images/new-chat.png" class="w-5 h-5" alt="Chat" />
        <p
          class="text-sm font-bold text-black hover:text-blue-500 transition-all"
          :class="isExpanded ? 'hidden' : 'inline'"
        >
          Obrolan Baru
        </p>
      </div>
      <p class="text-sm text-gray-500 mt-4 hover:text-blue-500 cursor-pointer">
        Obrolan
      </p>
    </div>

    <!-- Menu List -->
    <ul :class="isExpanded ? 'hidden' : 'space-y-2'">
      <li class="text-sm font-bold text-black hover:text-blue-500 hover:shadow-md p-3 rounded-lg cursor-pointer">
        Ringkasan Pendapatan
      </li>
      <li class="text-sm font-bold text-black hover:text-blue-500 hover:shadow-md p-3 rounded-lg cursor-pointer">
        Draft Surat Dinas
      </li>
    </ul>
  </div>
</template>

<script setup>
import logoPln from "./../assets/images/logo-pln.png";
import logoIconPlus from "./../assets/images/logo-iconPlus.png";
import { onMounted, ref } from "vue";

const isExpanded = ref(true);

function hoverSidebar() {
  isExpanded.value = false;
}

function resetSidebar() {
  isExpanded.value = true;
}
</script>
<style></style>
