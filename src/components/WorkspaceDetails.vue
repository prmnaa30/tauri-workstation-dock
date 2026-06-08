<template>
  <main class="flex-1 bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center relative">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-blue-900/10 blur-[120px]"></div>
      <div class="absolute bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[100px]"></div>
    </div>

    <div v-if="workspace" class="relative z-10 w-full h-full p-8 flex flex-col">
      <div class="border-b border-slate-800 pb-4 mb-4">
        <div v-if="isEditingName">
          <input ref="nameInputRef" v-model="editedName" @blur="saveChanges" @keyup.enter="saveChanges"
            class="text-3xl font-bold text-white bg-slate-900/50 border-b-2 border-blue-500 focus:outline-none w-full px-2 py-1 rounded-t-md" />
        </div>
        <h2 v-else @click="startNameEditing"
          class="text-3xl font-bold text-white px-2 py-1 cursor-text hover:bg-slate-800/50 rounded-md transition-colors"
          title="Click to edit name">
          {{ workspace.name }}
        </h2>
        
        <div v-if="isEditingDesc" class="mt-2">
          <input ref="descInputRef" v-model="editedDesc" @blur="saveChanges" @keyup.enter="saveChanges"
            class="text-slate-400 bg-slate-900/50 border-b-2 border-blue-500 focus:outline-none w-full px-2 py-1 rounded-t-md"
            placeholder="Type a description..." />
        </div>
        <p v-else @click="startDescEditing"
          class="text-slate-400 mt-2 px-2 py-1 cursor-text hover:bg-slate-800/50 rounded-md transition-colors"
          title="Click to edit description">
          {{ workspace.description || 'No description provided. Click to add one.' }}
        </p>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-4">

        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-300 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Shortcuts
          </h3>
          <button @click="isAddingShortcut = !isAddingShortcut"
            class="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700">
            {{ isAddingShortcut ? 'Cancel' : '+ Add Shortcut' }}
          </button>
        </div>

        <div v-if="isAddingShortcut" class="bg-slate-900/80 p-4 rounded-xl border border-blue-500/30 shadow-lg mb-2">
          <form @submit.prevent="submitShortcut" class="flex flex-col gap-3">
            <div class="flex gap-3">
              <input v-model="newShortcut.title" type="text" placeholder="Shortcut Title (e.g., Figma Design)" required
                class="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-200">
              <select v-model="newShortcut.type"
                class="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-200 w-32">
                <option value="web">🌐 Web URL</option>
                <option value="folder">📁 Folder</option>
                <option value="file">📄 File</option>
              </select>
            </div>

            <input v-model="newShortcut.path" type="text"
              placeholder="Target Path (e.g., https://figma.com/file/... atau C:\Projects)" required
              class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-200 font-mono">

            <input v-if="newShortcut.type === 'web'" v-model="newShortcut.browser_path" type="text"
              placeholder="Optional: Custom Browser Exe (e.g., brave, msedge, chrome)"
              class="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-400 font-mono">

            <button type="submit"
              class="self-end px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-blue-500/20 transition-all">Save
              Shortcut</button>
          </form>
        </div>

        <div v-if="shortcuts!.length === 0 && !isAddingShortcut"
          class="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-700/50 rounded-2xl bg-slate-800/10">
          <p class="text-slate-500">No shortcuts configured yet.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="sc in shortcuts" :key="sc.id" @click="executeShortcutAction(sc)"
            class="group bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-blue-500/40 rounded-xl p-4 flex flex-col gap-2 cursor-pointer transition-all hover:-translate-y-1 shadow-lg hover:shadow-blue-500/10">
            <div class="flex justify-between items-start">
              <div
                class="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                <span v-if="sc.type === 'web'" class="text-xl">🌐</span>
                <span v-else-if="sc.type === 'folder'" class="text-xl">📁</span>
                <span v-else class="text-xl">📄</span>
              </div>
              <button @click.stop="removeShortcut(sc.id)"
                class="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-all">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div>
              <h4 class="font-bold text-slate-200">{{ sc.title }}</h4>
              <p class="text-xs text-slate-500 truncate mt-1 font-mono" :title="sc.path">{{ sc.path }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="relative z-10 flex flex-col items-center text-slate-500">
      <div
        class="w-16 h-16 mb-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center shadow-lg backdrop-blur-sm">
        <svg class="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      </div>
      <p class="text-lg font-medium text-slate-300">Select a Workspace</p>
      <p class="text-sm mt-1">Choose an item from the sidebar to view details</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import type { Workspace } from '../services/workspaces';
import { addShortcut, deleteShortcut, getShortcuts, Shortcut } from '../services/shortcuts';
import { invoke } from '@tauri-apps/api/core';

const props = defineProps<{
  workspace: Workspace | null;
}>();

const emit = defineEmits<{
  (e: 'update', id: number, payload: { name: string, description: string }): void;
}>();

const isEditingName = ref(false);
const isEditingDesc = ref(false);
const editedName = ref('');
const editedDesc = ref('');

const nameInputRef = ref<HTMLInputElement | null>(null);
const descInputRef = ref<HTMLInputElement | null>(null);

watch(() => props.workspace, (newWs) => {
  if (newWs) {
    editedName.value = newWs.name;
    editedDesc.value = newWs.description || '';
  }

  isEditingName.value = false
  isEditingDesc.value = false
}, { immediate: true });

function startNameEditing() {
  isEditingName.value = true;
  nextTick(() => nameInputRef.value?.focus());
}

function startDescEditing() {
  isEditingDesc.value = true;
  nextTick(() => descInputRef.value?.focus());
}

function saveChanges() {
  if (isEditingName.value || isEditingDesc.value) {
    const finalName = editedName.value.trim() || 'Untitled Workspace';
    const finalDesc = editedDesc.value.trim();

    isEditingName.value = false;
    isEditingDesc.value = false;

    if (props.workspace && (finalName !== props.workspace.name || finalDesc !== props.workspace.description)) {
      emit('update', props.workspace.id, { name: finalName, description: finalDesc });
    }
  }
}

const shortcuts = ref<Shortcut[]>();
const isAddingShortcut = ref(false);
const newShortcut = ref<{ title: string, type: 'web' | 'folder' | 'file', path: string, browser_path: string }>({
  title: '',
  type: 'web',
  path: '',
  browser_path: ''
})

watch(() => props.workspace, async (newWs) => {
  if (newWs) {
    editedName.value = newWs.name;
    editedDesc.value = newWs.description;
    shortcuts.value = await getShortcuts(newWs.id);
  } else {
    shortcuts.value = [];
  }

  isEditingName.value = false;
  isEditingDesc.value = false;
}, { immediate: true })

async function submitShortcut() {
  if (!props.workspace || !newShortcut.value.title || !newShortcut.value.path) return;

  await addShortcut(
    props.workspace.id,
    newShortcut.value.title,
    newShortcut.value.type,
    newShortcut.value.path,
    newShortcut.value.type === 'web' && newShortcut.value.browser_path ? newShortcut.value.browser_path : null
  );

  newShortcut.value = {
    title: '',
    type: 'web',
    path: '',
    browser_path: ''
  }
  isAddingShortcut.value = false;
  shortcuts.value = await getShortcuts(props.workspace.id);
}

async function removeShortcut(id: number) {
  if (confirm("Delete this shortcut?")) {
    await deleteShortcut(id);
    if (props.workspace) shortcuts.value = await getShortcuts(props.workspace.id);
  }
}

async function executeShortcutAction(shortcut: Shortcut) {
  try {
    await invoke('execute_shortcut', {
      path: shortcut.path,
      shortcutType: shortcut.type,
      browser: shortcut.browser_path || null
    });
  } catch (error) {
    alert(`Oops! Failed to execute shortcut:\n${error}`)
  }
}
</script>