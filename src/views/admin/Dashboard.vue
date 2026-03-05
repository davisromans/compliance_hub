<template>
  <div class="max-w-7xl mx-auto mt-6 animate-fade-in pb-20">
    <div class="glass-panel p-5 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">Compliance Hub Admin</h1>
        <p class="text-gray-400 text-sm">Data synced securely with GitHub API.</p>
      </div>
      <div class="flex gap-3 w-full sm:w-auto">
        <button @click="handleLogout" class="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-dark-700 text-sm font-medium hover:bg-dark-900 border border-white/5 transition-colors">
          Lock
        </button>
        <button @click="publishToGithub" :disabled="isPublishing || isLoading" class="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-bold hover:bg-primary-500 shadow-lg shadow-primary-600/30 transition-all flex justify-center items-center gap-2">
          <svg v-if="isPublishing" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          {{ isPublishing ? 'Publishing...' : 'Save & Publish' }}
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      <div class="lg:col-span-1 space-y-4">
        <div class="glass-panel p-4 flex justify-between items-center">
          <h2 class="font-bold text-white">Your Apps</h2>
          <button @click="createNewProject" class="p-1.5 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500 hover:text-white transition-colors" title="Add App">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          </button>
        </div>

        <div class="space-y-2">
          <button 
            v-for="(project, index) in projects" 
            :key="index"
            @click="selectProject(index)"
            :class="['w-full text-left p-3 rounded-xl border transition-all duration-200', activeProjectIndex === index ? 'bg-dark-800 border-primary-500 shadow-md shadow-primary-500/10' : 'bg-dark-800/40 border-white/5 text-gray-400 hover:text-gray-200 hover:bg-dark-800/60']"
          >
            <div class="font-bold text-sm mb-0.5 truncate">{{ project.name || 'Unnamed App' }}</div>
            <div class="text-xs truncate opacity-70">/p/{{ project.code || 'code' }}</div>
          </button>
        </div>
      </div>

      <div class="lg:col-span-3 glass-panel p-6 sm:p-8" v-if="activeProject">
        <div class="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h2 class="text-lg font-bold text-white">App Configuration</h2>
          <button @click="deleteCurrentProject" class="text-sm text-danger-400 hover:text-danger-300 flex items-center gap-1 bg-danger-500/10 px-3 py-1.5 rounded-lg border border-danger-500/20 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            <span class="hidden sm:inline">Delete App</span>
          </button>
        </div>

        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div class="md:col-span-1">
              <label class="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">App Name</label>
              <input v-model="activeProject.name" type="text" class="w-full bg-dark-900 border border-dark-700 text-white px-3.5 py-2.5 rounded-lg focus:ring-1 focus:ring-primary-500 focus:outline-none" />
            </div>
            <div class="md:col-span-1">
              <label class="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">URL Slug (Code)</label>
              <input v-model="activeProject.code" type="text" class="w-full bg-dark-900 border border-dark-700 text-white px-3.5 py-2.5 rounded-lg focus:ring-1 focus:ring-primary-500 focus:outline-none" />
            </div>
            <div class="md:col-span-1">
              <label class="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Delete API URL</label>
              <input v-model="activeProject.deleteApiUrl" type="url" placeholder="https://..." class="w-full bg-dark-900 border border-dark-700 text-white px-3.5 py-2.5 rounded-lg focus:ring-1 focus:ring-primary-500 focus:outline-none font-mono text-sm" />
            </div>
          </div>

          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div class="flex flex-col h-full">
              <div class="flex justify-between items-end mb-1.5">
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider">Privacy Policy (HTML)</label>
              </div>
              <textarea v-model="activeProject.privacyPolicy" rows="16" class="w-full flex-1 bg-dark-900 border border-dark-700 text-white px-4 py-3 rounded-lg focus:ring-1 focus:ring-primary-500 focus:outline-none font-mono text-sm leading-relaxed custom-scrollbar"></textarea>
            </div>

            <div class="flex flex-col h-full">
              <div class="flex justify-between items-end mb-1.5">
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider">Terms of Service (HTML)</label>
              </div>
              <textarea v-model="activeProject.terms" rows="16" placeholder="<h1>Terms of Service</h1>..." class="w-full flex-1 bg-dark-900 border border-dark-700 text-white px-4 py-3 rounded-lg focus:ring-1 focus:ring-primary-500 focus:outline-none font-mono text-sm leading-relaxed custom-scrollbar"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProjects, saveProjects } from '../../utils/github'

const router = useRouter()
const projects = ref([])
const currentSha = ref(null)
const activeProjectIndex = ref(0)
const isLoading = ref(true)
const isPublishing = ref(false)

const activeProject = computed(() => projects.value[activeProjectIndex.value])

onMounted(async () => {
  if (sessionStorage.getItem('isAdminAuth') !== 'true') {
    router.push('/admin/login')
    return
  }
  const result = await getProjects()
  projects.value = result.data.length ? result.data : [{ name: 'ADM Ministry', code: 'adm', deleteApiUrl: 'http://172.105.118.145/api/auth/web-delete', privacyPolicy: '<h2>Privacy Policy</h2>', terms: '<h2>Terms of Service</h2>' }]
  currentSha.value = result.sha
  isLoading.value = false
})

const handleLogout = () => {
  sessionStorage.removeItem('isAdminAuth')
  router.push('/')
}

const selectProject = (index) => activeProjectIndex.value = index

const createNewProject = () => {
  projects.value.push({ name: 'New App', code: `app-${Date.now()}`, deleteApiUrl: '', privacyPolicy: '', terms: '' })
  activeProjectIndex.value = projects.value.length - 1
}

const deleteCurrentProject = () => {
  if(confirm(`Remove ${activeProject.value.name}?`)) {
    projects.value.splice(activeProjectIndex.value, 1)
    activeProjectIndex.value = projects.value.length > 0 ? 0 : null
  }
}

const publishToGithub = async () => {
  isPublishing.value = true
  try {
    const result = await saveProjects(projects.value, currentSha.value)
    currentSha.value = result.content.sha 
    alert('✅ Successfully published to GitHub! Public pages updated.')
  } catch (error) {
    alert('❌ Failed to publish: ' + error.message)
  } finally {
    isPublishing.value = false
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #374151; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #4B5563; }
</style>