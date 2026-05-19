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
        <h1 class="text-3xl font-bold text-white mb-2">Delete account</h1>
        <p class="text-gray-400 text-sm">
          For <strong class="text-white">{{ project ? project.name : route.params.projectCode.toUpperCase() }}</strong>.
        </p>
      </div>

      <div v-if="isLoadingProject" class="flex justify-center items-center py-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-danger-500"></div>
      </div>

      <div v-else-if="!project" class="p-4 rounded-xl bg-danger-500/10 text-danger-400 border border-danger-500/20 text-sm text-center">
        Unknown project code <code>{{ route.params.projectCode }}</code>. Return to the hub and pick a listed app.
      </div>

      <!-- ============ EMAIL-TOKEN FLOW (Amo View etc.) ============ -->
      <template v-else-if="flow === 'email-token'">

        <!-- Step 2 — confirm token from the email -->
        <div v-if="urlToken">
          <p class="text-gray-300 text-sm mb-2">
            You're one tap away from permanently deleting your account.
          </p>
          <p class="text-gray-500 text-xs mb-6 leading-relaxed">
            We will remove your profile, channel, push tokens and personally identifiable data within 24 hours. Wallet balance is forfeited. This cannot be undone.
          </p>

          <div class="flex items-start gap-2 mb-5">
            <input id="confirm" type="checkbox" v-model="confirmed" class="mt-1 accent-danger-500" />
            <label for="confirm" class="text-xs text-gray-400 leading-relaxed">
              I understand this is permanent and cannot be undone.
            </label>
          </div>

          <button
            @click="handleConfirm"
            :disabled="isLoading || !confirmed"
            class="w-full py-3.5 px-4 bg-danger-500 hover:bg-danger-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
            <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Deleting…' : 'Confirm and delete my account' }}
          </button>

          <div v-if="message" :class="['mt-5 p-4 rounded-xl text-sm font-medium text-center', isError ? 'bg-danger-500/10 text-danger-400 border border-danger-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20']">
            {{ message }}
          </div>

          <p v-if="!isError && message" class="mt-4 text-xs text-gray-500 text-center">
            You may now close this window.
          </p>
        </div>

        <!-- Step 1 — request the email -->
        <div v-else>
          <p class="text-gray-300 text-sm mb-1">
            Enter the email on your {{ project.name }} account.
          </p>
          <p class="text-gray-500 text-xs mb-6 leading-relaxed">
            We'll send a confirmation link to your inbox. Click it to finish deleting your account — no password needed. Works for accounts created with Google or Apple sign-in too.
          </p>

          <form @submit.prevent="handleRequest" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Account email</label>
              <input
                type="email"
                v-model="identifier"
                required
                placeholder="you@example.com"
                autocomplete="username"
                class="w-full bg-dark-900 border border-dark-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-danger-500/50 transition-all placeholder-gray-600" />
              <p class="text-xs text-gray-500 mt-2 leading-relaxed">
                Don't have an email on your account? Open the Amo View app, go to <em>Edit profile</em>, add an email, then come back here.
              </p>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-3.5 px-4 bg-danger-500 hover:bg-danger-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
              <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Sending…' : 'Send confirmation email' }}
            </button>

            <div v-if="message" :class="['p-4 rounded-xl text-sm font-medium text-center', isError ? 'bg-danger-500/10 text-danger-400 border border-danger-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20']">
              {{ message }}
            </div>
          </form>
        </div>
      </template>

      <!-- ============ LEGACY PASSWORD FLOW (ADM, default) ============ -->
      <form v-else @submit.prevent="handlePasswordDelete" class="space-y-5">
        <p class="text-gray-500 text-xs mb-2 leading-relaxed">
          Enter your credentials to permanently erase your data.
        </p>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Phone number or email</label>
          <input
            type="text"
            v-model="identifier"
            required
            placeholder="e.g. +255..."
            autocomplete="username"
            class="w-full bg-dark-900 border border-dark-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-danger-500/50 transition-all placeholder-gray-600" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Password</label>
          <input
            type="password"
            v-model="password"
            required
            placeholder="••••••••"
            autocomplete="current-password"
            class="w-full bg-dark-900 border border-dark-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-danger-500/50 transition-all placeholder-gray-600" />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3.5 px-4 bg-danger-500 hover:bg-danger-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
          <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isLoading ? 'Processing…' : 'Permanently delete account' }}
        </button>

        <div v-if="message" :class="['p-4 rounded-xl text-sm font-medium text-center', isError ? 'bg-danger-500/10 text-danger-400 border border-danger-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20']">
          {{ message }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getProjects } from '../../utils/github'

const route = useRoute()
const identifier = ref('')
const password = ref('')
const confirmed = ref(false)
const isLoading = ref(false)
const message = ref('')
const isError = ref(false)

const project = ref(null)
const isLoadingProject = ref(true)

const flow = computed(() => (project.value && project.value.deleteFlow) || 'password')

// vue-router with hash mode lets us read the query off route.query.
const urlToken = computed(() => route.query.token || '')

onMounted(async () => {
  const projectCode = route.params.projectCode.toLowerCase()
  try {
    const result = await getProjects()
    project.value = result.data.find(p => p.code.toLowerCase() === projectCode) || null
  } catch (e) {
    console.error('Failed to load project metadata:', e)
  } finally {
    isLoadingProject.value = false
  }
})

const handleRequest = async () => {
  if (!project.value?.deleteApiUrl) {
    isError.value = true
    message.value = 'This app is missing a deletion endpoint. Contact the app owner.'
    return
  }
  isLoading.value = true
  message.value = ''
  isError.value = false

  try {
    const response = await fetch(`${project.value.deleteApiUrl}/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ identifier: identifier.value.trim() })
    })
    let data = {}
    try { data = await response.json() } catch (_) {}

    if (response.ok && data.success !== false) {
      isError.value = false
      message.value = data.message || "If that email is on file, we've sent a confirmation link."
      identifier.value = ''
    } else {
      isError.value = true
      message.value = data.error || data.message || 'Could not send the confirmation email. Try again in a minute.'
    }
  } catch (error) {
    isError.value = true
    message.value = 'Network error: check your connection and try again.'
    console.error('Request error:', error)
  } finally {
    isLoading.value = false
  }
}

const handleConfirm = async () => {
  if (!project.value?.deleteApiUrl) {
    isError.value = true
    message.value = 'This app is missing a deletion endpoint. Contact the app owner.'
    return
  }
  isLoading.value = true
  message.value = ''
  isError.value = false

  try {
    const response = await fetch(`${project.value.deleteApiUrl}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ token: urlToken.value })
    })
    let data = {}
    try { data = await response.json() } catch (_) {}

    if (response.ok && data.success !== false) {
      isError.value = false
      message.value = data.message || 'Account deleted. You may close this window.'
      confirmed.value = false
    } else {
      isError.value = true
      message.value = data.error || data.message || 'Could not confirm deletion. The link may have expired.'
    }
  } catch (error) {
    isError.value = true
    message.value = 'Network error: check your connection and try again.'
    console.error('Confirm error:', error)
  } finally {
    isLoading.value = false
  }
}

// Legacy single-call password flow (ADM Ministry & other apps that haven't
// migrated to the email-token pattern yet).
const handlePasswordDelete = async () => {
  if (!project.value?.deleteApiUrl) {
    isError.value = true
    message.value = 'This app is missing a deletion endpoint. Contact the app owner.'
    return
  }
  isLoading.value = true
  message.value = ''
  isError.value = false

  try {
    const response = await fetch(project.value.deleteApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        identifier: identifier.value.trim(),
        password: password.value,
      })
    })
    let data = {}
    try { data = await response.json() } catch (_) {}

    if (response.ok && data.success !== false) {
      isError.value = false
      message.value = data.message || 'Account successfully deleted. You may close this window.'
      identifier.value = ''
      password.value = ''
    } else {
      isError.value = true
      message.value = data.error || data.message || 'Failed to delete account. Please check your credentials.'
    }
  } catch (error) {
    isError.value = true
    message.value = 'Network error: check your connection and try again.'
    console.error('Delete error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
