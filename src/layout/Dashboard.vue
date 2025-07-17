<script setup>
import { onMounted, ref, watch } from "vue";
import Navbar from "./../components/Navbar.vue";
import UploadModal from "./../components/UploadModal.vue";
import { getSessionID, sendMessage } from "./../components/lib/api/api";
import ChatSection from "./../components/ChatSection.vue";
import { useChatStore } from "./../stores/Chat";
import Drawer from "../components/Drawer.vue";

const chatStarted = ref(true);
const inputMessage = ref("");
const message = ref([]);
const sessionID = ref(null);
const chatStore = useChatStore;
const isDisableInput = ref(false);

//mendapatkan session ID digunakan untuk kirim pertanyaan (/ask)
onMounted(async()=>{
  sessionID.value = await getSessionID();
  console.log(sessionID.value)
})

//function untuk submit pertanyaan
async function handleSubmit() {
  console.log("form submitted, please wait...");
  console.log(inputMessage.value)
  
  //simpan chatID dan message ke dalam store, ID tersebut digunakan untuk url (http://localhost:5173/dashboard/chatID)
  // chatStore.saveChatId(sessionID.value);  
  chatStarted.value = false;

  try {
  const userMessage = inputMessage.value; // simpan dulu isi input sebelum dikosongkan
  inputMessage.value = ""; // langsung kosongkan input setelah kirim
  isDisableInput.value = true;
  
  // Tambahkan pesan user ke daftar chat jika perlu
  message.value.push({
    text: userMessage,
    sender: "user",
    isLoading: false,
  });


  // Tambahkan balasan bot ke daftar chat
  message.value.push({
    text: '',
    sender: "bot",
    isLoading: true,
  });

    // Kirim ke API dan tunggu balasan
  const response = await sendMessage(sessionID.value, userMessage);

  // Ambil index pesan bot terakhir (yang masih isLoading)
  const botMsgIndex = message.value.findLastIndex(msg => msg.sender === 'bot' && msg.isLoading);

  // Update pesan bot tersebut
  if (botMsgIndex !== -1) {
    message.value[botMsgIndex].text = response;
    message.value[botMsgIndex].isLoading = false;
  }

  } catch (err) {
    console.log(err);
  } finally {
    isDisableInput.value = false;
  }
}
</script>

<template>
  <div>
    <div class="min-h-screen flex md:px-7 ">
      <!-- Sidebar -->
      <aside
        id="sidebar"
        class="hidden lg:inline py-7 min-h-screen transition-all duration-500 [transition-timing-function:cubic-bezier(0.68,-0.55,0.27,1.55)]"
      >
        <Navbar />
      </aside>
      <Drawer/>
      <!-- Main Content -->
      <main class="relative z-10 flex flex-col flex-1 md:pl-8  py-7 min-h-full  ">
        <div class="mb-8 px-4 pb-4 md:px-0  shadow-xs  flex justify-between md:hidden">
             <button class="text-white   focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm focus:outline-none " type="button" data-drawer-target="drawer-navigation" data-drawer-show="drawer-navigation" aria-controls="drawer-navigation">
              <img src="./../assets/images/hamburger-menu.png" class="w-7 h-7" alt="">
            </button>
          <p class="font-bold">ACMT BOT</p>
          <img src="./../assets/images/new-chat(2).png" class="w-6 h-6" alt="">
        </div>
        <div class="relative h-full ">
          <!-- Chat Section -->
          <div
            v-if="!chatStarted"
            class="flex-1 flex flex-col h-[600px] overflow-y-auto gap-y-3 "
          >
            <ChatSection :message="message" />
          </div>
          <!-- header content -->
          <div v-if="chatStarted" class="flex justify-between items-center">
            <div id="header-content" class="px-4 md:px-0">
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
            class="mt-10 gap-6 hidden md:grid md:grid-cols-3 "
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
                <span class="text-blue-500">ACMT BOT</span>
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
          <div class="absolute bottom-0 w-full px-4 md:px-0 ">
            <!-- Search Box -->
            <form
              class="relative bg-white rounded-2xl shadow-md flex items-center p-4 w-full "
              id="input-form"
              @submit.prevent="handleSubmit"
            >
              <input v-if="isDisableInput"
                disabled
                v-model="inputMessage"
                type="text"
                name="prompt-input"
                placeholder='type a message...'
                class="flex-1 text-sm border-none focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400 outline-none sticky bottom-0 cursor-not-allowed"
              />
              <input v-else
                v-model="inputMessage"
                type="text"
                name="prompt-input"
                placeholder='type a message...'
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
