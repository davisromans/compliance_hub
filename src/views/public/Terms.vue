<template>
  <div class="max-w-4xl mx-auto glass-panel p-5 sm:p-8 md:p-12 mb-12 sm:mb-20 relative">
    <div class="flex items-start gap-3 sm:gap-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-white/10 min-w-0">
      <router-link to="/" class="p-2 rounded-lg bg-dark-700 hover:bg-dark-900 transition-colors group shrink-0">
        <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </router-link>
      <div v-if="project">
        <h1 class="text-xl sm:text-3xl font-bold text-white leading-tight break-words">{{ project.name }} Terms of Service</h1>
      </div>
      <div v-else-if="!isLoading">
        <h1 class="text-xl sm:text-3xl font-bold text-white leading-tight">Project Not Found</h1>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>

    <div v-else-if="project" class="prose prose-invert max-w-none text-gray-300">
      <div v-if="project.terms" v-html="project.terms" class="dynamic-html-content"></div>
      
      <div v-else>
        <h2 class="text-white font-bold text-2xl mb-4">1. Acceptance of Terms</h2>
        <p class="mb-6 leading-relaxed">
          By accessing and using {{ project.name }}, you accept and agree to be bound by the terms and provision of this agreement.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getProjects } from '../../utils/github'

const route = useRoute()
const project = ref(null)
const isLoading = ref(true)

onMounted(async () => {
  const projectCode = route.params.projectCode.toLowerCase()
  try {
    const result = await getProjects()
    project.value = result.data.find(p => p.code.toLowerCase() === projectCode)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style>
.dynamic-html-content h1 { @apply text-white font-bold text-2xl sm:text-3xl leading-tight mb-5 sm:mb-6 border-b border-white/10 pb-4 break-words; }
.dynamic-html-content h2 { @apply text-white font-bold text-xl sm:text-2xl leading-tight mb-3 sm:mb-4 mt-7 sm:mt-8 break-words; }
.dynamic-html-content h3 { @apply text-white font-semibold text-lg sm:text-xl mb-3 mt-5 sm:mt-6 break-words; }
.dynamic-html-content p { @apply mb-5 sm:mb-6 leading-7 text-sm sm:text-base text-gray-300 break-words; }
.dynamic-html-content ul { @apply list-disc pl-5 sm:pl-6 mb-5 sm:mb-6 space-y-2 text-sm sm:text-base text-gray-400; }
.dynamic-html-content li { @apply leading-7 break-words; }
.dynamic-html-content a { @apply text-primary-500 hover:text-white break-words; }
.dynamic-html-content strong { @apply text-gray-100 font-bold; }
</style>
