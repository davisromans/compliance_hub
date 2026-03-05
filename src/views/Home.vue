<template>
  <div class="max-w-4xl mx-auto mt-6 animate-fade-in">
    <div class="text-center mb-10">
      <h1 class="text-3xl md:text-4xl font-extrabold text-white mb-3">Trust & Compliance Hub</h1>
      <p class="text-base text-gray-400">Select an application to view its policies or manage your data.</p>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
      <div v-for="project in projects" :key="project.code" class="glass-panel p-5 group hover:border-primary-500/50 transition-all duration-300 relative overflow-hidden flex flex-col">
        <div class="relative z-10 flex-1">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform">
               <span class="text-lg font-bold text-primary-400">{{ project.name.charAt(0) }}</span>
            </div>
            <h2 class="text-lg font-bold text-white leading-tight">{{ project.name }}</h2>
          </div>
          
          <div class="flex flex-wrap gap-2 mt-auto">
            <router-link :to="`/p/${project.code}/privacy`" class="flex-1 text-center px-2 py-1.5 rounded-md bg-dark-700 text-xs font-medium hover:bg-dark-900 border border-white/5 transition-colors">
              Privacy
            </router-link>
            <router-link :to="`/p/${project.code}/terms`" class="flex-1 text-center px-2 py-1.5 rounded-md bg-dark-700 text-xs font-medium hover:bg-dark-900 border border-white/5 transition-colors">
              Terms
            </router-link>
            <router-link :to="`/p/${project.code}/delete-account`" class="w-full text-center px-3 py-1.5 mt-1 rounded-md bg-danger-500/10 text-danger-500 text-xs font-medium hover:bg-danger-500 hover:text-white border border-danger-500/20 transition-colors">
              Delete Account
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