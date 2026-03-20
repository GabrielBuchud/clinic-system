<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <div class="max-w-5xl mx-auto">
      <!-- Título + Lista de consultas (agora no topo) -->
      <h2 class="text-3xl font-bold text-gray-800 mb-8">Minhas Consultas Agendadas</h2>

      <div class="mt-6">
        <div v-if="agendamentos.length === 0" class="text-center text-gray-600 py-12 bg-white rounded-xl shadow">
          Nenhuma consulta agendada ainda.
        </div>

        <div v-else class="space-y-6">
          <div
            v-for="a in agendamentos"
            :key="a._id"
            class="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-blue-300 transition"
          >
            <div class="flex justify-between items-start">
              <div>
                <p class="text-lg font-semibold text-gray-800">
                  {{ new Date(a.date).toLocaleDateString('pt-BR') }} às {{ a.time }}
                </p>
                <p class="text-gray-600 mt-1"><strong>Motivo:</strong> {{ a.reason }}</p>
                <p class="text-gray-600"><strong>Endereço:</strong> {{ a.address || 'Não informado' }}</p>
              </div>
              <p
                class="font-bold px-4 py-2 rounded-full text-sm"
                :class="a.weatherAlert.includes('chuva') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
              >
                {{ a.weatherAlert }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulário de agendamento (agora abaixo da lista) -->
      <div class="mt-12">
        <AppointmentForm @agendado="carregarAgendamentos" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AppointmentForm from '@/components/AppointmentForm.vue'

const agendamentos = ref([])

const carregarAgendamentos = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('Token não encontrado')
      return
    }

    const res = await axios.get('/api/appointments', {
      headers: { Authorization: `Bearer ${token}` }
    })

    agendamentos.value = res.data
  } catch (err) {
    console.error('Erro ao carregar agendamentos:', err)
  }
}

onMounted(carregarAgendamentos)
</script>