# Clínica Saúde+ - Sistema de Agendamento de Consultas

Sistema web completo para gerenciamento de agendamentos de consultas em clínicas de pequeno porte.

## Funcionalidades implementadas

- Cadastro e login seguro de usuários (pacientes e secretários) com autenticação JWT
- Agendamento de consultas com verificação de horário disponível
- Consulta automática de endereço via CEP (ViaCEP)
- Integração com previsão do tempo (OpenWeatherMap) → alerta de chuva no dia da consulta
- Dashboard do paciente: ver suas consultas + formulário para agendar novas
- Dashboard do secretário: ver todos os agendamentos + excluir
- Navbar condicional (aparece só após login, com nome do usuário e botão Sair)
- Proteção de rotas (paciente não acessa /admin, secretário não acessa /patient)

## Tecnologias utilizadas

**Frontend**
- Vue.js 3 (Composition API + <script setup>)
- Vite
- Vue Router
- Axios
- Tailwind CSS

**Backend**
- Node.js + Express
- MongoDB (Atlas) + Mongoose
- JWT
- bcryptjs
- Axios

## Como rodar localmente

### Backend
```bash
cd backend
npm install