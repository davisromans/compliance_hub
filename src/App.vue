<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden">
    
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/20 blur-[120px] rounded-full pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-danger-500/10 blur-[100px] rounded-full pointer-events-none"></div>

    <nav class="fixed top-0 w-full z-50 p-4">
      <div class="max-w-7xl mx-auto glass-panel px-6 py-4 flex justify-between items-center">
        <router-link to="/" class="flex items-center gap-3 group">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-blue-400 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <span class="font-bold text-lg tracking-wide text-white group-hover:text-primary-400 transition-colors">Trust Center</span>
        </router-link>

        <router-link to="/admin/login" class="text-sm font-medium text-gray-400 hover:text-white transition-colors">
          Admin Login
        </router-link>
      </div>
    </nav>

    <main class="flex-1 mt-28 mb-12 max-w-7xl mx-auto w-full px-4 sm:px-6 relative z-10">
      <router-view></router-view>
    </main>

    <footer class="w-full py-6 text-center text-gray-500 text-sm relative z-10 border-t border-white/5">
      &copy; {{ new Date().getFullYear() }} Centralized Trust & Compliance. All rights reserved.
    </footer>
  </div>
</template>

<script setup>
// Global setup logic will go here
</script>