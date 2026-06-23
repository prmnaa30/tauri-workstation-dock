<template>
  <div class="flex items-center">
    <div 
      class="relative flex items-center transition-all duration-300 overflow-hidden" 
      :class="isSearchOpen ? 'w-48 sm:w-64' : 'w-9'"
    >
      <UButton
        v-if="!isSearchOpen"
        icon="i-lucide-search"
        variant="ghost"
        title="Search"
        @click="openSearch"
      />
      
      <UInput
        v-show="isSearchOpen"
        ref="searchInputRef"
        v-model="searchQuery"
        icon="i-lucide-search"
        placeholder="Search..."
        class="w-full"
        @blur="closeSearchIfEmpty"
        :ui="{
          base: 'ring-slate-700 focus-visible:ring-1 focus-visible:ring-slate-500 transition-all duration-200'
        }"
      >
        <template #trailing>
          <UButton
            v-show="searchQuery !== ''"
            color="gray"
            variant="link"
            icon="i-lucide-x"
            :padded="false"
            title="Clear search"
            @click="clearSearch"
          />
        </template>
      </UInput>
    </div>

    <UDropdownMenu :items="dropdownItems" :content="{ align: 'end' }">
      <UButton variant="ghost" icon="i-lucide-arrow-up-down" title="Sort options" />
    </UDropdownMenu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';

const props = defineProps<{
  sortOptions: { label: string, value: string }[]
}>();

const searchQuery = defineModel<string>('search', { default: '' });
const sortKey = defineModel<string>('sortKey', { default: 'title' });
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'asc' });

const isSearchOpen = ref(false);
const searchInputRef = ref<any>(null);

function openSearch() {
  isSearchOpen.value = true;
  nextTick(() => {
    if (searchInputRef.value && searchInputRef.value.$el) {
      const input = searchInputRef.value.$el.querySelector('input');
      if (input) input.focus();
    }
  });
}

function closeSearchIfEmpty() {
  if (!searchQuery.value) {
    isSearchOpen.value = false;
  }
}

function clearSearch() {
  searchQuery.value = '';
  nextTick(() => {
    if (searchInputRef.value && searchInputRef.value.$el) {
      const input = searchInputRef.value.$el.querySelector('input');
      if (input) input.focus();
    }
  });
}

function handleSort(key: string) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
}

const dropdownItems = computed(() => {
  return [
    props.sortOptions.map(option => {
      const isActive = sortKey.value === option.value;
      return {
        label: option.label,
        icon: isActive 
          ? (sortOrder.value === 'asc' ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down') 
          : 'i-lucide-minus',
        onSelect: () => handleSort(option.value), // Ini yang memicu aksi saat opsi dipilih
        class: isActive ? 'text-blue-400 font-medium' : ''
      };
    })
  ];
});
</script>