# Clínica Saúde+ - Sistema de Agendamento de Consultas

Projeto desenvolvido para gerenciamento de agendamentos de consultas em clínicas de pequeno porte, com foco em simplicidade, segurança e integração com APIs externas.

## Funcionalidades principais

- Cadastro e login seguro de usuários (pacientes e secretários) com autenticação JWT
- Agendamento de consultas com verificação de disponibilidade de horário
- Consulta automática de endereço completo pelo CEP (Via API ViaCEP)
- Integração com previsão do tempo (OpenWeatherMap) → alerta de chuva no dia da consulta
- Dashboard do paciente: visualizar suas consultas + formulário para agendar novas
- Dashboard do secretário (admin): visualizar todos os agendamentos + excluir consultas
- Navbar condicional (aparece apenas após login, com nome do usuário e botão "Sair")
- Proteção de rotas: paciente não acessa painel administrativo e vice-versa
- Design responsivo e moderno com Tailwind CSS

## Tecnologias utilizadas

**Frontend**
- Vue.js 3 (Composition API + `<script setup>`)
- Vite (build tool)
- Vue Router
- Axios (para chamadas HTTP)
- Tailwind CSS (estilização)

**Backend**
- Node.js + Express
- MongoDB (Atlas) + Mongoose
- JWT (autenticação)
- bcryptjs (hash de senhas)
- Axios (integrações externas)

**Integrações externas**
- ViaCEP: consulta de endereço por CEP
- OpenWeatherMap: previsão do tempo e alerta de chuva

## Como rodar localmente

### Pré-requisitos
- Node.js v18 ou superior
- Conta gratuita no MongoDB Atlas
- Chave gratuita da OpenWeatherMap[](https://openweathermap.org/api)

### Backend
```bash
cd backend
npm install