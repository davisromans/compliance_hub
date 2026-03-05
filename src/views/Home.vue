<template>
  <div class="max-w-5xl mx-auto mt-10 animate-fade-in">
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-extrabold text-white mb-4">Trust & Compliance Hub</h1>
      <p class="text-lg text-gray-400">Select an application to view its policies or manage your data.</p>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="project in projects" :key="project.code" class="glass-panel p-8 group hover:border-primary-500/50 transition-all duration-300 relative overflow-hidden">
        <div class="relative z-10">
          <div class="w-12 h-12 rounded-xl bg-dark-700 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
             <span class="text-xl font-bold text-primary-400">{{ project.name.charAt(0) }}</span>
          </div>
          <h2 class="text-2xl font-bold text-white mb-2">{{ project.name }}</h2>
          <p class="text-gray-400 text-sm mb-6 truncate">{{ project.deleteApiUrl }}</p>
          
          <div class="flex gap-3">
            <router-link :to="`/p/${project.code}/privacy`" class="px-4 py-2 rounded-lg bg-dark-700 text-sm font-medium hover:bg-dark-900 border border-white/5 transition-colors">
              Privacy Policy
            </router-link>
            <router-link :to="`/p/${project.code}/delete-account`" class="px-4 py-2 rounded-lg bg-danger-500/10 text-danger-500 text-sm font-medium hover:bg-danger-500 hover:text-white transition-colors">
              Delete Data
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getProjects } from '../utils/github'

const projects = ref([])
const isLoading = ref(true)

onMounted(async () => {
  const result = await getProjects()
  projects.value = result.data
  isLoading.value = false
})
</script>