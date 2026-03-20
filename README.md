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
npm run dev

### Frontend
```bash
cd frontend
npm install
npm run dev

## Como usar o sistema

1. Acesse http://localhost:5173
2. Cadastre-se ou faça login:
   - Paciente: antonio@gmail.com / 123mudar
   - Secretário: carol@gmail.com / 123mudar
3. No dashboard do paciente: agende consultas com CEP e veja alerta de clima
4. No dashboard do secretário: veja todos os agendamentos e exclua se necessário

Desenvolvido por Gabriel Buchud  
Rio de Janeiro - Março/2026