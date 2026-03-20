<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <div class="max-w-5xl mx-auto">
      <h2 class="text-3xl font-bold text-gray-800 mb-8">Minhas Consultas Agendadas</h2>

      <!-- Lista de consultas (agora no topo) -->
      <div class="space-y-6">
        <div v-if="agendamentos.length === 0" class="text-center text-gray-600 py-12 bg-white rounded-xl shadow">
          Nenhuma consulta agendada ainda.
        </div>

        <div v-else v-for="a in agendamentos" :key="a._id" class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-lg font-semibold text-gray-800">
                {{ new Date(a.date).toLocaleDateString('pt-BR') }} às {{ a.time }}
              </p>
              <p class="text-gray-600 mt-1"><strong>Motivo:</strong> {{ a.reason }}</p>
              <p class="text-gray-600"><strong>Endereço:</strong> {{ a.address || 'Não informado' }}</p>
            </div>
            <div class="flex gap-3">
              <button @click="abrirEditar(a)" class="text-blue-600 hover:text-blue-800 font-medium">
                Editar
              </button>
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

      <!-- Formulário de agendamento (abaixo da lista) -->
      <div class="mt-12">
        <AppointmentForm @agendado="carregarAgendamentos" />
      </div>

      <!-- Modal de edição -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full mx-4">
          <h3 class="text-2xl font-bold text-gray-800 mb-6">Editar Consulta</h3>

          <form @submit.prevent="salvarEdicao" class="space-y-6">
            <div>
              <label class="block text-gray-700 font-medium mb-2">Data</label>
              <input v-model="editForm.date" type="date" class="w-full p-3 border rounded-lg" required />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">Horário</label>
              <input v-model="editForm.time" type="time" class="w-full p-3 border rounded-lg" required />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">Motivo</label>
              <input v-model="editForm.reason" type="text" class="w-full p-3 border rounded-lg" required />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">CEP</label>
              <input v-model="editForm.cep" type="text" maxlength="8" class="w-full p-3 border rounded-lg" />
            </div>

            <div class="flex gap-4 mt-8">
              <button type="submit" class="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">
                Salvar Alterações
              </button>
              <button type="button" @click="showModal = false" class="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-400">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AppointmentForm from '@/components/AppointmentForm.vue'

const agendamentos = ref([])
const showModal = ref(false)
const editForm = ref({
  id: null,
  date: '',
  time: '',
  reason: '',
  cep: ''
})

const carregarAgendamentos = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('/api/appointments', {
      headers: { Authorization: `Bearer ${token}` }
    })
    agendamentos.value = res.data
  } catch (err) {
    console.error('Erro ao carregar:', err)
  }
}

const abrirEditar = (consulta) => {
  editForm.value = {
    id: consulta._id,
    date: new Date(consulta.date).toISOString().split('T')[0],
    time: consulta.time,
    reason: consulta.reason,
    cep: consulta.cep || ''
  }
  showModal.value = true
}

const salvarEdicao = async () => {
  try {
    const token = localStorage.getItem('token')

    // Corrige o fuso horário: adiciona 1 dia se necessário
    const correctedDate = new Date(editForm.value.date);
    correctedDate.setHours(12);  // força meio-dia para evitar perda de dia

    const payload = {
      ...editForm.value,
      date: correctedDate.toISOString().split('T')[0]  // mantém YYYY-MM-DD
    };

    await axios.put(`/api/appointments/${editForm.value.id}`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert('Consulta atualizada com sucesso!');
    showModal.value = false;
    carregarAgendamentos();
  } catch (err) {
    alert(err.response?.data?.msg || 'Erro ao atualizar consulta');
  }
};

onMounted(carregarAgendamentos)
</script>