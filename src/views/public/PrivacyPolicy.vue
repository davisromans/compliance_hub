<template>
  <article class="max-w-3xl mx-auto">
    <div class="mb-8 sm:mb-10">
      <router-link to="/" class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white group mb-6">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to hub
      </router-link>
      <div v-if="project">
        <p class="text-xs font-bold tracking-[0.22em] uppercase text-primary-500 mb-3">{{ project.name }}</p>
        <h1 class="text-3xl sm:text-4xl font-bold text-white leading-tight break-words">Privacy Policy</h1>
      </div>
      <div v-else-if="!isLoading">
        <h1 class="text-3xl sm:text-4xl font-bold text-white leading-tight">Project Not Found</h1>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>

    <div v-else-if="project" class="policy-document text-gray-300">
      <div v-if="project.privacyPolicy" v-html="project.privacyPolicy" class="dynamic-html-content"></div>
      
      <div v-else>
        <h2 class="text-white font-bold text-2xl mb-4">1. Introduction</h2>
        <p class="mb-6 leading-relaxed">
          Welcome to {{ project.name }}. We are committed to protecting your personal data and your right to privacy.
        </p>
      </div>
    </div>
  </article>
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
.policy-document { @apply rounded-2xl border border-white/10 bg-dark-800 px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10; }
.dynamic-html-content h1 { @apply text-white font-bold text-2xl sm:text-3xl leading-tight mb-5 sm:mb-6 border-b border-white/10 pb-4 break-words; }
.dynamic-html-content h2 { @apply text-white font-bold text-xl sm:text-2xl leading-tight mb-3 mt-9 sm:mt-10 break-words; }
.dynamic-html-content h3 { @apply text-white font-semibold text-lg sm:text-xl mb-3 mt-6 break-words; }
.dynamic-html-content p { @apply mb-5 leading-8 text-[15px] sm:text-base text-gray-300 break-words; }
.dynamic-html-content ul { @apply list-disc pl-5 sm:pl-6 mb-6 space-y-3 text-[15px] sm:text-base text-gray-400; }
.dynamic-html-content li { @apply leading-8 break-words; }
.dynamic-html-content a { @apply text-primary-500 hover:text-white break-words; }
.dynamic-html-content strong { @apply text-gray-100 font-bold; }
</style>
