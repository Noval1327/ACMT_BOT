<script setup>
import { onMounted, ref } from "vue";
import Navbar from "./Navbar.vue";
import UploadModal from "./UploadModal.vue";
import { getSessionID, sendMessage } from "./lib/api/api";
import ChatSection from "./ChatSection.vue";

const chatStarted = ref(true);
const inputMessage = ref("");
const message = ref([]);
const sessionID = ref(null);

onMounted(async()=>{
  sessionID.value = await getSessionID();
  console.log(sessionID.value)
})

async function handleSubmit() {
  console.log("form submitted, please wait...");
  console.log(inputMessage.value)

  chatStarted.value = false;

  try {
  const userMessage = inputMessage.value; // simpan dulu isi input sebelum dikosongkan
  inputMessage.value = ""; // langsung kosongkan input setelah kirim
  
  // Tambahkan pesan user ke daftar chat jika perlu
  message.value.push({
    text: userMessage,
    sender: "user",
  });

  // Kirim ke API dan tunggu balasan
  const response = await sendMessage(sessionID.value, userMessage);

  // Tambahkan balasan bot ke daftar chat
  message.value.push({
    text: response,
    sender: "bot",
  });

} catch (err) {
  console.log(err);
}
}
</script>

<template>
  <div>
    <div class="min-h-screen flex px-7">
      <!-- Sidebar -->
      <aside
        id="sidebar"
        class="hidden lg:inline py-7 min-h-screen transition-all duration-500 [transition-timing-function:cubic-bezier(0.68,-0.55,0.27,1.55)]"
      >
        <Navbar />
      </aside>

      <!-- Main Content -->
      <main class="relative z-10 flex flex-col flex-1 px-8 py-7 min-h-full">
        <div class="relative h-full">
          <!-- Chat Section -->
          <div
            v-if="!chatStarted"
            class="flex-1 flex flex-col h-[600px] overflow-y-auto gap-y-3"
          >
            <ChatSection :message="message" />
          </div>
          <!-- header content -->
          <div v-if="chatStarted" class="flex justify-between items-center">
            <div id="header-content ">
              <h1 class="text-3xl">
                Hi
                <span class="text-blue-500 font-bold cursor-pointer">Jeff</span
                ><br />How May
                <span class="font-bold">I assist you today?</span>
              </h1>
            </div>
          </div>
          <!-- Card Section -->
          <section
            class="mt-10 gap-6 md:grid md:grid-cols-3"
            id="section-card"
            v-if="chatStarted"
          >
            <!-- Card 1 -->
            <div
              class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <img
                src="./../assets/images/bookmarks.png"
                class="w-8 h-8 mb-3"
                alt="Bookmarks icon"
              />
              <h3 class="text-lg font-semibold mb-2">
                Contribute ideas, offer feedback, and manage tasks — all in
                sync.
              </h3>
              <p class="text-sm text-gray-500">Fast Start</p>
            </div>

            <!-- Card 2 -->
            <div
              class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <div class="mb-3">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2111/2111615.png"
                  class="w-8 h-8"
                  alt="Slack icon"
                />
              </div>
              <h3 class="text-lg font-semibold mb-2">
                Stay connected, Boost your productivity with
                <span class="text-blue-500">Nura</span>
              </h3>
              <p class="text-sm text-gray-500">Collaborate with Team</p>
            </div>

            <!-- Card 3 -->
            <div
              class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <div class="mb-3">
                <img
                  src="./../assets/images/calender.png"
                  class="w-8 h-8"
                  alt="Google Calendar"
                />
              </div>
              <h3 class="text-lg font-semibold mb-2">
                Organize your time efficiently, set clear priorities, and stay
                focused
              </h3>
              <p class="text-sm text-gray-500">Planning</p>
            </div>
          </section>
          <div class="absolute bottom-0 w-full">
            <!-- Search Box -->
            <form
              class="relative bg-white rounded-2xl shadow-md flex items-center p-4 w-full"
              id="input-form"
              @submit.prevent="handleSubmit"
            >
              <span
                id="btn-file"
                class="text-xl text-gray-400 cursor-pointer"
                data-modal-target="default-modal"
                data-modal-toggle="default-modal"
                >➕</span
              >
              <input
                v-model="inputMessage"
                type="text"
                name="prompt-input"
                placeholder='type a message..."'
                class="flex-1 text-sm border-none focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400 outline-none sticky bottom-0"
              />
              <!-- Send Button -->
              <button
                type="submit"
                class="w-9 h-9 flex items-center justify-center bg-[#1e1f3a] rounded-full text-white text-lg hover:bg-[#2b2c4d] transition"
              >
                ➤
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  </div>
  <UploadModal ref="uploadModalRef" />
</template>

<style scoped></style>
