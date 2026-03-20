<template>
  <!-- O formulário inteiro só aparece se NÃO for secretary (admin) -->
  <div v-if="!isSecretary" class="bg-white p-6 rounded-lg shadow-md mb-10">
    <h3 class="text-2xl font-bold text-gray-800 mb-6">Agendar Nova Consulta</h3>

    <form @submit.prevent="agendar" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-gray-700 font-medium mb-2">Data da consulta</label>
          <input
            v-model="form.date"
            type="date"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">Horário</label>
          <input
            v-model="form.time"
            type="time"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label class="block text-gray-700 font-medium mb-2">Motivo da consulta</label>
        <input
          v-model="form.reason"
          type="text"
          placeholder="Ex: Check-up anual, dor de cabeça, retorno..."
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label class="block text-gray-700 font-medium mb-2">CEP (preenche endereço automático)</label>
        <input
          v-model="form.cep"
          placeholder="Ex: 22775030"
          maxlength="8"
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Agendando...' : 'Agendar Consulta' }}
      </button>
    </form>
  </div>

  
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps({
  isSecretary: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['agendado'])

const form = ref({
  date: '',
  time: '',
  reason: '',
  cep: ''
})

const isSubmitting = ref(false)

const agendar = async () => {
  isSubmitting.value = true

  try {
    const payload = { ...form.value }

    await axios.post('/api/appointments', payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    alert('Consulta agendada com sucesso!')
    emit('agendado')  // Recarrega a lista no dashboard
    form.value = { date: '', time: '', reason: '', cep: '' }
  } catch (err) {
    console.error('Erro ao agendar:', err)
    alert(err.response?.data?.msg || 'Erro ao agendar a consulta')
  } finally {
    isSubmitting.value = false
  }
}
</script>