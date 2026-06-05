<script setup lang="ts">
import { ref } from "vue";
import { invoke } from "@tauri-apps/api/core";

const greetMsg = ref("");
const name = ref("");

async function greet() {
  greetMsg.value = await invoke("greet", { name: name.value });
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col items-center justify-center p-8 transition-colors duration-300">
    
    <h1 class="text-4xl font-bold tracking-tight mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
      Welcome to Tauri + Vue
    </h1>

    <div class="flex justify-center items-center gap-6 mb-6">
      <a href="https://vite.dev" target="_blank" class="group">
        <img src="/vite.svg" class="h-24 p-4 transition-all duration-500 group-hover:drop-shadow-[0_0_2em_#747bff] group-hover:scale-105" alt="Vite logo" />
      </a>
      <a href="https://tauri.app" target="_blank" class="group">
        <img src="/tauri.svg" class="h-24 p-4 transition-all duration-500 group-hover:drop-shadow-[0_0_2em_#24c8db] group-hover:scale-105" alt="Tauri logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank" class="group">
        <img src="./assets/vue.svg" class="h-24 p-4 transition-all duration-500 group-hover:drop-shadow-[0_0_2em_#249b73] group-hover:scale-105" alt="Vue logo" />
      </a>
    </div>

    <p class="text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium">
      Click on the Tauri, Vite, and Vue logos to learn more.
    </p>

    <form class="flex justify-center items-center gap-3 mb-6 w-full max-w-md" @submit.prevent="greet">
      <input 
        id="greet-input" 
        v-model="name" 
        placeholder="Enter a name..." 
        class="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 shadow-sm outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-400"
      />
      <button 
        type="submit"
        class="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium shadow-md transition-all duration-200 hover:bg-indigo-500 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        Greet
      </button>
    </form>
    
    <p v-if="greetMsg" class="text-lg font-semibold text-indigo-600 dark:text-indigo-400 animate-fade-in">
      {{ greetMsg }}
    </p>
  </main>
</template>

<style scoped>

</style>