<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Login</h2>

      <form @submit.prevent="login" class="space-y-6">
        <div>
          <label class="block text-gray-700 font-medium mb-2">E-mail</label>
          <input
            v-model="email"
            type="email"
            placeholder="exemplo@dominio.com"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">Senha</label>
          <input
            v-model="password"
            type="password"
            placeholder="Sua senha"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <p class="text-center mt-6 text-gray-600">
        Não tem conta? 
        <router-link to="/register" class="text-blue-600 hover:underline">Cadastre-se</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const isLoading = ref(false)

const login = async () => {
  isLoading.value = true

  try {
    // Log para depurar o que está sendo enviado
    console.log('Tentando login com:', {
      email: email.value.trim(),
      password: password.value
    })

    const res = await axios.post('/api/auth/login', {
      email: email.value.trim(),
      password: password.value
    })

    console.log('Resposta do login:', res.data)

    localStorage.setItem('token', res.data.token)
    localStorage.setItem('role', res.data.role)
    localStorage.setItem('name', res.data.name || 'Usuário')

    // Redireciona baseado no role
    const redirectPath = res.data.role === 'secretary' ? '/admin' : '/patient'
    router.push(redirectPath)
  } catch (err) {
    console.error('Erro completo no login:', err)

    let mensagem = 'Erro ao entrar'

    if (err.response) {
      if (err.response.status === 400) {
        mensagem = err.response.data.msg || 'Credenciais inválidas'
      } else if (err.response.status === 500) {
        mensagem = 'Erro no servidor. Verifique o terminal do backend'
      } else {
        mensagem = `Erro ${err.response.status}: ${err.response.data?.msg || 'Desconhecido'}`
      }
    } else if (err.request) {
      mensagem = 'Sem resposta do servidor. O backend está rodando?'
    } else {
      mensagem = err.message
    }

    alert(mensagem)
  } finally {
    isLoading.value = false
  }
}
</script>