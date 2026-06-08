<template>
  <aside
    class="w-72 bg-slate-900/60 backdrop-blur-2xl border-r border-slate-800/50 flex flex-col shadow-2xl relative z-10">
    <div class="p-6 border-b border-slate-800/50 bg-slate-900/40">
      <div class="flex items-center gap-3 mb-6">
        <div
          class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </div>
        <h1
          class="text-lg font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
          Workstation
        </h1>
      </div>

      <div class="relative group">
        <svg
          class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="searchQuery" type="text" placeholder="Search workspaces..."
          class="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm placeholder-slate-500" />
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
      <div v-if="filteredWorkspaces.length === 0" class="flex flex-col items-center justify-center h-40 text-slate-500">
        <p class="text-xs font-medium">{{ searchQuery ? 'No matches found' : 'No workspaces yet' }}</p>
      </div>

      <!-- Favorites Section -->
      <div v-if="favoriteWorkspaces.length > 0" class="mb-4">
        <h4 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Favorites</h4>
        <div v-for="ws in favoriteWorkspaces" :key="ws.id" @click="$emit('select', ws)"
          class="group flex items-center justify-between p-3 rounded-xl bg-slate-800/20 hover:bg-slate-800/60 border hover:border-slate-700/50 cursor-pointer transition-all duration-200 mb-2"
          :class="activeWorkspaceId === ws.id ? 'border-blue-500/50 bg-slate-800/80' : 'border-transparent'">
          <div class="flex items-center gap-3">
            <button @click.stop="$emit('toggle-favorite', ws)" 
              class="hover:scale-110 transition-transform focus:outline-none">
              <svg 
                :class="ws.is_favorite === 1 ? 'text-yellow-400' : 'text-slate-600 hover:text-yellow-400/50'" 
                class="w-4 h-4 transition-colors" 
                fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
            <div class="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-colors"
              :class="activeWorkspaceId === ws.id ? 'bg-blue-400' : 'bg-blue-500/50 group-hover:bg-blue-400'"></div>
            <h3 class="text-sm font-medium transition-colors"
              :class="activeWorkspaceId === ws.id ? 'text-white' : 'text-slate-300 group-hover:text-white'">
              {{ ws.name }}
            </h3>
          </div>
          <button @click.stop="$emit('delete', ws.id)"
            class="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Recent Section -->
      <div v-if="recentWorkspaces.length > 0">
        <h4 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Recent Workspaces</h4>
        <div v-for="ws in recentWorkspaces" :key="ws.id" @click="$emit('select', ws)"
          class="group flex items-center justify-between p-3 rounded-xl bg-slate-800/20 hover:bg-slate-800/60 border hover:border-slate-700/50 cursor-pointer transition-all duration-200 mb-2"
          :class="activeWorkspaceId === ws.id ? 'border-blue-500/50 bg-slate-800/80' : 'border-transparent'">
          <div class="flex items-center gap-3">
            <button @click.stop="$emit('toggle-favorite', ws)" 
              class="hover:scale-110 transition-transform focus:outline-none">
              <svg 
                :class="ws.is_favorite === 1 ? 'text-yellow-400' : 'text-slate-600 hover:text-yellow-400/50'" 
                class="w-4 h-4 transition-colors" 
                fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
            <div class="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-colors"
              :class="activeWorkspaceId === ws.id ? 'bg-blue-400' : 'bg-blue-500/50 group-hover:bg-blue-400'"></div>
            <h3 class="text-sm font-medium transition-colors"
              :class="activeWorkspaceId === ws.id ? 'text-white' : 'text-slate-300 group-hover:text-white'">
              {{ ws.name }}
            </h3>
          </div>
          <button @click.stop="$emit('delete', ws.id)"
            class="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="p-4 border-t border-slate-800/50 bg-slate-900/80">
      <form v-if="isAddingWorkspace" @submit.prevent="submitCreate"
        class="mb-3 p-3 bg-slate-950/50 rounded-xl border border-slate-700/50 flex flex-col gap-2">
        <input ref="workspaceInputRef" v-model="newName" type="text" placeholder="Workspace name..."
          class="w-full px-3 py-2 bg-transparent border-b border-slate-700 focus:outline-none focus:border-blue-500 transition-all text-sm text-slate-200"
          required />

        <input v-model="newDescription" type="text" placeholder="Description (optional)"
          class="w-full px-3 py-2 bg-transparent border-b border-slate-700 focus:outline-none focus:border-blue-500 transition-all text-sm text-slate-400" />

        <div class="flex justify-end gap-2 mt-1">
          <button type="button" @click="isAddingWorkspace = false"
            class="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors">Cancel</button>
          <button type="submit"
            class="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md shadow-lg shadow-blue-500/20 transition-all">Save</button>
        </div>
      </form>

      <button v-else @click="toggleAddForm"
        class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-blue-500/50 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all group">
        <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span class="text-sm font-medium">Add new workspace</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import type { Workspace } from '../services/workspaces';

const props = defineProps<{
  workspaces: Workspace[];
  activeWorkspaceId?: number | null;
}>();

const emit = defineEmits<{
  (e: 'create', payload: { name: string, description: string }): void;
  (e: 'delete', id: number): void;
  (e: 'select', workspace: Workspace): void;
  (e: 'toggle-favorite', workspace: Workspace): void;
}>();

const isAddingWorkspace = ref(false);
const searchQuery = ref('');
const newName = ref('');
const newDescription = ref('');
const workspaceInputRef = ref<HTMLInputElement | null>(null);

const filteredWorkspaces = computed(() => {
  if (!searchQuery.value) return props.workspaces;
  const lowerQuery = searchQuery.value.toLowerCase();
  return props.workspaces.filter(ws => ws.name.toLowerCase().includes(lowerQuery));
});

const favoriteWorkspaces = computed(() => {
  return filteredWorkspaces.value.filter(ws => ws.is_favorite === 1);
});

const recentWorkspaces = computed(() => {
  return filteredWorkspaces.value.filter(ws => ws.is_favorite !== 1);
});

function toggleAddForm() {
  isAddingWorkspace.value = true;
  nextTick(() => { if (workspaceInputRef.value) workspaceInputRef.value.focus(); });
}

function submitCreate() {
  if (!newName.value.trim()) return;
  emit('create', { name: newName.value, description: newDescription.value });
  newName.value = '';
  newDescription.value = '';
  isAddingWorkspace.value = false;
}
</script>