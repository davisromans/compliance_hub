<template>
  <div class="max-w-xl mx-auto relative mt-10">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-danger-500/20 blur-[80px] rounded-full pointer-events-none"></div>
    
    <div class="glass-panel border-danger-500/30 p-8 md:p-10 relative z-10">
      <router-link to="/" class="inline-flex items-center text-sm text-gray-400 hover:text-white mb-6 transition-colors group">
        <svg class="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        Back to Hub
      </router-link>

      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-danger-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-danger-500/20">
          <svg class="w-8 h-8 text-danger-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Delete Account</h1>
        <p class="text-gray-400 text-sm">Enter your credentials for <strong class="text-white uppercase">{{ route.params.projectCode }}</strong> to permanently erase your data.</p>
      </div>

      <form @submit.prevent="handleDelete" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Phone Number or Email</label>
          <input type="text" v-model="identifier" required placeholder="e.g. +255..." 
            class="w-full bg-dark-900 border border-dark-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-danger-500/50 transition-all placeholder-gray-600" />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Password</label>
          <input type="password" v-model="password" required placeholder="••••••••" 
            class="w-full bg-dark-900 border border-dark-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-danger-500/50 transition-all placeholder-gray-600" />
        </div>

        <div class="pt-4">
          <button type="submit" :disabled="isLoading" 
            class="w-full py-3.5 px-4 bg-danger-500 hover:bg-danger-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2">
            <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Processing Deletion...' : 'Permanently Delete Account' }}
          </button>
        </div>

        <div v-if="message" :class="['p-4 rounded-xl text-sm font-medium text-center', isError ? 'bg-danger-500/10 text-danger-400 border border-danger-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20']">
          {{ message }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const identifier = ref('')
const password = ref('')
const isLoading = ref(false)
const message = ref('')
const isError = ref(false)

const handleDelete = async () => {
  isLoading.value = true
  message.value = ''
  isError.value = false

  // Dictionary of APIs based on the project code
  // If it's ADM, it points to your server. 
  const apiUrls = {
    'adm': 'http://172.105.118.145/api/auth/web-delete',
    'default': 'http://172.105.118.145/api/auth/web-delete'
  }
  
  const project = route.params.projectCode.toLowerCase()
  const apiUrl = apiUrls[project] || apiUrls['default']

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        identifier: identifier.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (response.ok) {
      isError.value = false
      message.value = data.message || 'Account successfully deleted. You may close this window.'
      identifier.value = ''
      password.value = ''
    } else {
      isError.value = true
      message.value = data.error || 'Failed to delete account. Please check your credentials.'
    }
  } catch (error) {
    isError.value = true
    message.value = 'Network Error: Please ensure you are connected to the internet.'
    console.error('Delete error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>