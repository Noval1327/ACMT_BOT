<template>
  <main class="flex-1 overflow-y-auto space-y-2 no-scrollbar pb-32 pr-5">
    <div
      v-for="(msg, index) in message"
      :key="index"
      :class="[
        'flex',
        msg.sender === 'user' ? 'justify-end ' : 'justify-start ',
      ]"
    >
      <div
        :class="[
          ' p-3 rounded-lg shadow text-sm',
          msg.sender === 'user'
            ? 'bg-blue-500 text-white rounded-br-none max-w-1/2'
            : 'bg-white text-gray-800 rounded-bl-none w-2/3',
        ]"
      >
      <div v-if="msg.isLoading" class="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <div v-else>
        {{ msg.text }}
      </div>
      </div>
    </div>
  </main>
</template>

<script setup>
defineProps({
  message: String,
});
</script>
