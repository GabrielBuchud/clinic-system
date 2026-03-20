<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar só aparece se houver token (usuário logado) -->
    <nav v-if="isLoggedIn" class="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      <h1 class="text-2xl font-bold">Clínica Saúde+</h1>
      <div class="flex items-center gap-4">
        <span class="font-medium">{{ userName || 'Usuário' }}</span>
        <button @click="logout" class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition duration-200">
          Sair
        </button>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Estado reativo
const token = ref(localStorage.getItem('token'))
const name = ref(localStorage.getItem('name') || '')

// Computed para simplificar
const isLoggedIn = computed(() => !!token.value)
const userName = computed(() => name.value)

// Função para atualizar o estado
const updateAuth = () => {
  token.value = localStorage.getItem('token')
  name.value = localStorage.getItem('name') || ''
}

// Atualiza inicial
updateAuth()

// Polling leve para detectar mudanças na mesma aba (login salva token)
const intervalId = setInterval(updateAuth, 300) // 300ms é rápido o suficiente, mas leve

// Escuta mudanças em outras abas
window.addEventListener('storage', updateAuth)

// Limpa ao sair do componente
onUnmounted(() => {
  clearInterval(intervalId)
  window.removeEventListener('storage', updateAuth)
})

// Logout
const logout = () => {
  localStorage.clear()
  updateAuth()  // Atualiza imediatamente
  router.push('/login')
}
</script>