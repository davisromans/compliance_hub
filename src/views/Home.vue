<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-8 sm:mb-10">
      <p class="text-xs font-bold tracking-[0.22em] uppercase text-primary-500 mb-3">Trust Center</p>
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">Policies and account controls</h1>
      <p class="text-sm sm:text-base text-gray-400 leading-7 max-w-2xl">Select an application to view its policies, terms, or account deletion options.</p>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
      <div v-for="project in projects" :key="project.code" class="glass-panel p-5 group hover:border-primary-500/50 relative flex flex-col min-h-[178px]">
        <div class="relative z-10 flex flex-col flex-1">
          <div class="flex items-center gap-3 mb-6 min-w-0">
            <div class="w-11 h-11 rounded-lg bg-dark-700 flex items-center justify-center border border-white/10 shrink-0">
               <span class="text-lg font-bold text-primary-400">{{ project.name.charAt(0) }}</span>
            </div>
            <h2 class="text-lg font-bold text-white leading-tight break-words">{{ project.name }}</h2>
          </div>
          
          <div class="grid grid-cols-2 gap-2 mt-auto">
            <router-link :to="`/p/${project.code}/privacy`" class="text-center px-3 py-2.5 rounded-lg bg-dark-700 text-xs font-semibold hover:bg-dark-900 border border-white/5">
              Privacy
            </router-link>
            <router-link :to="`/p/${project.code}/terms`" class="text-center px-3 py-2.5 rounded-lg bg-dark-700 text-xs font-semibold hover:bg-dark-900 border border-white/5">
              Terms
            </router-link>
            <router-link :to="`/p/${project.code}/delete-account`" class="col-span-2 text-center px-3 py-2.5 rounded-lg bg-danger-500/10 text-danger-500 text-xs font-semibold hover:bg-danger-500 hover:text-white border border-danger-500/20">
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
