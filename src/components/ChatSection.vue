<template>
  <main class="flex-1 overflow-y-auto space-y-2 hide-scrollbae">
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
        {{ msg.text }}
      </div>
    </div>
  </main>
</template>

<script setup>
defineProps({
  message: String,
});
</script>
