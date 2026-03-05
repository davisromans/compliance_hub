<template>
  <div class="max-w-md mx-auto mt-20 relative">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary-500/20 blur-[80px] rounded-full pointer-events-none"></div>

    <div class="glass-panel p-8 relative z-10 border-primary-500/20">
      <div class="flex justify-center mb-6">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-blue-400 flex items-center justify-center shadow-lg shadow-primary-500/30">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
      </div>
      
      <h2 class="text-2xl font-bold text-white mb-2 text-center">Admin Access</h2>
      <p class="text-gray-400 text-sm text-center mb-8">Enter your master key to configure projects.</p>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <input 
            v-model="adminKey" 
            type="password" 
            placeholder="Master Key" 
            required
            class="w-full bg-dark-900 border border-dark-700 text-white px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all placeholder-gray-600" 
          />
        </div>
        
        <button type="submit" class="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-600/20">
          Unlock Dashboard
        </button>

        <p v-if="errorMessage" class="text-danger-400 text-sm text-center mt-4 bg-danger-500/10 py-2 rounded-lg border border-danger-500/20">
          {{ errorMessage }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const adminKey = ref('')
const errorMessage = ref('')

const handleLogin = () => {
  errorMessage.value = ''
  
  if (adminKey.value === 'Mwaisemba1994.') {
    sessionStorage.setItem('isAdminAuth', 'true')
    router.push('/admin/dashboard')
  } else {
    errorMessage.value = 'Incorrect Master Key'
    adminKey.value = '' 
  }
}
</script>