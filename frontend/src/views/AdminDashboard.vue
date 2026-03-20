<template>
  <div class="p-8">
    <AppointmentForm :is-secretary="true" @agendado="carregarAgendamentos" />

    <h3 class="text-2xl font-bold mt-12 mb-6 text-gray-800">Todos os Agendamentos</h3>

    <div v-if="agendamentos.length === 0" class="text-center text-gray-600">
      Nenhum agendamento ainda.
    </div>

    <div v-for="a in agendamentos" :key="a._id" class="bg-white p-6 rounded-lg shadow mb-4">
      <p><strong>Paciente:</strong> {{ a.patient?.name || 'Não informado' }} ({{ a.patient?.email }})</p>
      <p><strong>Data/Hora:</strong> {{ new Date(a.date).toLocaleDateString('pt-BR') }} às {{ a.time }}</p>
      <p><strong>Motivo:</strong> {{ a.reason }}</p>
      <p><strong>Endereço:</strong> {{ a.address || 'Não informado' }}</p>
      <p class="font-bold" :class="a.weatherAlert.includes('chuva') ? 'text-red-600' : 'text-green-600'">
        {{ a.weatherAlert }}
      </p>
      <button @click="excluir(a._id)" class="text-red-600 hover:text-red-800 mt-2">
        Excluir
      </button>
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
    const res = await axios.get('/api/appointments', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    agendamentos.value = res.data
  } catch (err) {
    console.error('Erro ao carregar agendamentos:', err)
  }
}

const excluir = async (id) => {
  if (confirm('Tem certeza que deseja excluir essa consulta?')) {
    try {
      await axios.delete(`/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      carregarAgendamentos()
      alert('Consulta excluída com sucesso')
    } catch (err) {
      alert('Erro ao excluir consulta')
    }
  }
}

onMounted(carregarAgendamentos)
</script>