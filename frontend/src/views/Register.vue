<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Cadastro</h2>
      
      <form @submit.prevent="register" class="space-y-6">
        <div>
          <label class="block text-gray-700 font-medium mb-2">Nome completo</label>
          <input 
            v-model="name" 
            type="text" 
            placeholder="Seu nome" 
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
            required 
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">E-mail</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="exemplo@dominio.com" 
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
            required 
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">Senha</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="Mínimo 6 caracteres" 
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
            required 
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">Tipo de conta</label>
          <select 
            v-model="role" 
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="patient">Paciente</option>
            <option value="secretary">Secretário(a)</option>
          </select>
        </div>

        <button 
          type="submit" 
          class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Cadastrando...' : 'Cadastrar' }}
        </button>
      </form>

      <p class="text-center mt-6 text-gray-600">
        Já tem conta? 
        <router-link to="/login" class="text-green-600 hover:underline">Faça login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('patient')
const isLoading = ref(false)

const register = async () => {
  isLoading.value = true
  
  try {
    const res = await axios.post('/api/auth/register', {  // ← usando o proxy /api
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value,
      role: role.value
    })

    // Salva os dados no localStorage
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('role', res.data.role)
    localStorage.setItem('name', name.value.trim())

    // Redireciona conforme o papel
    const redirectPath = res.data.role === 'secretary' ? '/admin' : '/patient'
    router.push(redirectPath)
  } catch (err) {
    console.error('Erro no cadastro:', err)
    
    let mensagem = 'Erro ao cadastrar. Tente novamente.'
    
    if (err.response) {
      if (err.response.status === 400) {
        mensagem = err.response.data.msg || 'E-mail já cadastrado ou dados inválidos'
      } else if (err.response.status === 500) {
        mensagem = 'Erro no servidor. Verifique se o backend está rodando.'
      }
    }
    
    alert(mensagem)
  } finally {
    isLoading.value = false
  }
}
</script>