<script setup>
import { ref } from "vue";
import { uploadFile } from "./lib/api/api";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

var notyf = new Notyf({
  position: {
    x: "right",
    y: "top",
  },
  duration: 3000,
  dismissible: true,
});

const $targetEl = document.getElementById("default-modal");
const options = {
  placement: "bottom-right",
  backdrop: "dynamic",
  backdropClasses: "bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40",
  closable: true,
  onShow: () => {
    modal.show();
    console.log("modal show");
  },
  onHide: () => {
    $("#uploadedFile-container").text("");
  },
};

const instanceOptions = {
  id: "default-modal",
  override: true,
};

const modal = new Modal($targetEl, options, instanceOptions);
$("#close-modal").on("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  modal.hide();
});

$(document).on("dragover", "#drop-area", function (e) {
  e.preventDefault();
  e.stopPropagation();
  console.log("Drag over event triggered");
  $(this).removeClass("bg-gray-50");
  $(this).addClass("bg-blue-100");
});

$("#drop-area").on("dragleave", function (e) {
  e.preventDefault();
  e.stopPropagation();
  alert("Drag leave event triggered");
  $(this).removeClass("bg-blue-100");
});

$(document).on("drop", "#drop-area", function (e) {
  e.preventDefault();
  const files = e.originalEvent.dataTransfer.files; // FileList
  $("#uploadedFile-container").text(""); // Reset kontainer file
  // Loop setiap file yang di-drop
  Array.from(files).forEach(function (item, index) {
    let size = (item.size / (1024 * 1024)).toFixed(2); // Konversi ke MB
    $("#uploadedFile-container").append(`
            <div class="mt-3 p-3 w-full text-left bg-slate-100 rounded-lg">
                <div class="flex items-center">
                    <img  alt="file" class="w-6 h-6 me-4">
                    <div class="w-full">
                        <p class="text-xs text-slate-800 dark:text-gray-400 font-semibold">${item.name}</p>
                        <span class="flex w-full">
                            <p class="text-xs text-slate-600">${size} MB</p>
                            <p class="text-xs text-slate-600 ms-auto" id="progress-bar-text-${index}">0%</p>
                        </span>
                    </div>
                </div>
                <div class="w-full mt-2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 flex">
                    <div class="bg-blue-600 h-1.5 rounded-full progress-bar w-0" data-file-index="${index}"></div>
                </div>
            </div>
    `);
  });
});

const fileInput = ref(null);
const allowedExtensions = ["pdf", "xls", "xlsx"];
const maxFileSize = 5 * 1024 * 1024; // 10 MB

async function handleSubmit(e) {
  e.preventDefault();
  const file = fileInput.value.files[0];
  console.log("File input value:", file);

  //script cek file telah dipilih atau belum
  if (!file) {
    alert("Please select a file to upload.");
    return;
  }

  //Script cek ekstensi file
  const fileExtension = file.name.split(".").pop().toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    notyf.error("Invalid file type. Only PDF and Excel files are allowed.");
    return;
  }

  //Script Cek ukuran file
  if (file.size > maxFileSize) {
    notyf.error("File size exceeds the maximum limit of 10 MB.");
    return;
  }
  try {
    const response = await uploadFile(file);
    notyf.success(response.message);
  } catch (error) {
    notyf.error("Failed to upload file. Please try again.");
  }
}

const selectedFiles = ref([]);
// Saat user pilih file
function handleFileChange(event) {
  const files = event.target.files;
  selectedFiles.value = Array.from(files).map((file, index) => ({
    name: file.name,
    size: (file.size / (1024 * 1024)).toFixed(2), // Convert ke MB
    progress: 0, // progress upload (%)
    index,
  }));
}

function showModal() {
  alert("Modal is shown");
}
defineExpose({ showModal });
</script>

<template>
  <!-- Main modal -->
  <div
    id="default-modal"
    tabindex="-1"
    aria-hidden="true"
    class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
  >
    <div class="relative p-4 w-full max-w-2xl max-h-full">
      <!-- Modal content -->
      <div
        class="relative bg-white rounded-lg shadow-sm transform translate-y-10 transition-transform duration-300"
      >
        <!-- Modal header -->
        <div
          class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200"
        >
          <h3 class="text-xl font-semibold text-gray-900">Upload Document</h3>
          <button
            type="button"
            id="close-modal"
            class="text-gray-400 cursor-pointer bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="default-modal"
          >
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-4 md:p-5 space-y-4">
          <form
            @submit.prevent="handleSubmit"
            @change="handleFileChange"
            enctype="multipart/form-data"
            id="form-upload"
          >
            <label
              id="drop-area"
              for="dropzone-file"
              class="flex flex-col items-center justify-center border-2 border-blue-200 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 max-[470px]:max-w-80"
            >
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <img class="w-10 h-10" src="../static/images/upload-file.png" />
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span
                    class="font-semibold text-black underline underline-offset-4"
                    >Click to upload</span
                  >
                  or drag and drop
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                class="hidden"
                accept=".pdf, xls"
                multiple
                name="file"
                ref="fileInput"
              />
            </label>
            <!-- File list with progress bar -->
            <div id="uploadedFile-container" class="mt-3">
              <div
                v-for="file in selectedFiles"
                :key="file.index"
                class="mt-3 p-3 w-full text-left bg-slate-100 rounded-lg"
              >
                <div class="flex items-center">
                  <img alt="file" class="w-6 h-6 me-4" />
                  <div class="w-full">
                    <p class="text-xs text-slate-800 font-semibold">
                      {{ file.name }}
                    </p>
                    <span class="flex w-full">
                      <p class="text-xs text-slate-600">{{ file.size }} MB</p>
                      <p
                        class="text-xs text-slate-600 ms-auto"
                        :id="`progress-bar-text-${file.index}`"
                      >
                        {{ file.progress }}%
                      </p>
                    </span>
                  </div>
                </div>
                <div class="w-full mt-2 bg-gray-200 rounded-full h-2.5 flex">
                  <div
                    class="bg-blue-600 h-1.5 rounded-full progress-bar"
                    :style="{ width: file.progress + '%' }"
                  ></div>
                </div>
              </div>
            </div>
            <button
              type="submit"
              class="ms-auto flex text-white mt-4 bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Upload
              <svg
                class="w-5 h-5 text-white dark:text-white ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
