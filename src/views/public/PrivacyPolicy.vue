<template>
  <div class="max-w-4xl mx-auto glass-panel p-8 md:p-12 mb-20 relative">
    <div class="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
      <router-link to="/" class="p-2 rounded-lg bg-dark-700 hover:bg-dark-900 transition-colors group">
        <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </router-link>
      <div>
        <h1 class="text-3xl font-bold text-white uppercase tracking-wider">{{ route.params.projectCode }} - Privacy Policy</h1>
        <p class="text-primary-500 text-sm mt-1 font-medium">Last Updated: March 2026</p>
      </div>
    </div>

    <div class="prose prose-invert max-w-none text-gray-300">
      <h2 class="text-white font-bold text-2xl mb-4">1. Introduction</h2>
      <p class="mb-6 leading-relaxed">
        Welcome to our application. We respect your privacy and are fully committed to protecting your personal data. This privacy policy informs you about how we handle your personal data when you use our application, regardless of where you visit it from, and tells you about your privacy rights and how the law protects you.
      </p>

      <h2 class="text-white font-bold text-2xl mb-4">2. The Data We Collect About You</h2>
      <p class="mb-4 leading-relaxed">We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together as follows:</p>
      <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-400">
        <li><strong class="text-gray-200">Identity Data:</strong> Includes first name, last name, username, or similar identifiers.</li>
        <li><strong class="text-gray-200">Contact Data:</strong> Includes email address and telephone numbers.</li>
        <li><strong class="text-gray-200">Technical Data:</strong> Includes internet protocol (IP) address, your login data, browser type and version, time zone setting, and location.</li>
        <li><strong class="text-gray-200">Usage Data:</strong> Includes information about how you use our app, services, and interact with organizational tools.</li>
      </ul>

      <h2 class="text-white font-bold text-2xl mb-4">3. How We Use Your Personal Data</h2>
      <p class="mb-4 leading-relaxed">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
      <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-400">
        <li>To register you as a new user within the organization.</li>
        <li>To manage our relationship with you, including sending notifications and updates.</li>
        <li>To administer and protect our ministry operations and this application (including troubleshooting, data analysis, testing, system maintenance, and support).</li>
      </ul>

      <h2 class="text-white font-bold text-2xl mb-4">4. Disclosures of Your Personal Data</h2>
      <p class="mb-6 leading-relaxed">
        We do not sell your personal data to third parties. We may share your personal data with trusted internal administrators (e.g., Pastors or Organization Admins) strictly for operational purposes. We may also share data with third-party service providers (such as secure cloud hosting environments or SMS gateways like Beem Africa) exclusively to provide the services you request. All third parties are required to respect the security of your personal data and treat it in accordance with the law.
      </p>

      <h2 class="text-white font-bold text-2xl mb-4">5. Data Security</h2>
      <p class="mb-6 leading-relaxed">
        We have put in place appropriate industry-standard security measures to prevent your personal data from being accidentally lost, used, accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
      </p>

      <h2 class="text-white font-bold text-2xl mb-4">6. Your Legal Rights & Account Deletion</h2>
      <p class="mb-6 leading-relaxed">
        Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request the erasure of your personal data. 
        <br><br>
        If you wish to exercise your right to account deletion, you may do so directly within the App Settings, or by using the 
        <router-link :to="`/p/${route.params.projectCode}/delete-account`" class="text-primary-400 hover:text-primary-300 underline">Account Deletion Tool</router-link> 
        provided on this platform. Once a deletion request is authenticated, your personally identifiable information will be permanently erased or anonymized from our active servers.
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>