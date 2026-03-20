const Appointment = require('../models/Appointment');
const User = require('../models/User');
const axios = require('axios');

exports.create = async (req, res) => {
  const { date, time, reason, cep, patientEmail } = req.body;

  try {
    let patient;
    if (req.user.role === 'patient') {
      patient = await User.findById(req.user.id);
    } else {
      patient = await User.findOne({ email: patientEmail });
    }
    if (!patient) return res.status(404).json({ msg: 'Paciente não encontrado' });

    // Verifica disponibilidade
    const existing = await Appointment.findOne({ date: new Date(date + 'T12:00:00'), time });
    if (existing) return res.status(400).json({ msg: 'Horário indisponível' });

    // Consulta CEP
    let address = '', city = '';
    if (cep) {
      const cepRes = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (!cepRes.data.erro) {
        address = `${cepRes.data.logradouro}, ${cepRes.data.bairro}, ${cepRes.data.localidade} - ${cepRes.data.uf}`;
        city = cepRes.data.localidade;
      }
    }

    // Consulta clima
    let weatherAlert = 'Clima não verificado';
    if (city && process.env.OPENWEATHER_API_KEY) {
      try {
        const weatherRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric&lang=pt_br`
        );
        const list = weatherRes.data.list;
        const dayForecasts = list.filter(item => item.dt_txt.startsWith(date));

        const hasRain = dayForecasts.some(item =>
          item.weather[0].main === 'Rain' || item.pop > 0.5
        );

        weatherAlert = hasRain
          ? '⚠️ ALERTA: Previsão de chuva no dia da consulta!'
          : '🌤️ Tempo bom previsto para o dia.';
      } catch (e) {
        weatherAlert = 'Não foi possível verificar o clima';
      }
    }

    const appointment = new Appointment({
      patient: patient._id,
      date: new Date(date + 'T12:00:00'), // Força meio-dia local para evitar perda de dia
      time,
      reason,
      address,
      city,
      weatherAlert
    });

    await appointment.save();
    res.json({ msg: 'Consulta agendada com sucesso!', appointment });
  } catch (err) {
    console.error('Erro ao criar consulta:', err);
    res.status(500).json({ msg: 'Erro ao agendar' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const appointments = req.user.role === 'secretary'
      ? await Appointment.find().populate('patient', 'name email')
      : await Appointment.find({ patient: req.user.id }).populate('patient', 'name');

    res.json(appointments);
  } catch (err) {
    console.error('Erro ao listar consultas:', err);
    res.status(500).json({ msg: 'Erro ao buscar agendamentos' });
  }
};

exports.delete = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ msg: 'Consulta não encontrada' });

    // Permite secretary OU o próprio paciente
    if (req.user.role !== 'secretary' && appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Acesso negado' });
    }

    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Consulta cancelada com sucesso' });
  } catch (err) {
    console.error('Erro ao cancelar consulta:', err);
    res.status(500).json({ msg: 'Erro no servidor ao cancelar' });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { date, time, reason, cep } = req.body;

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ msg: 'Consulta não encontrada' });

    // Permite edição se for o dono ou secretary
    if (appointment.patient.toString() !== req.user.id && req.user.role !== 'secretary') {
      return res.status(403).json({ msg: 'Acesso negado' });
    }

    // Verifica disponibilidade do novo horário (exceto o próprio)
    const existing = await Appointment.findOne({
      date: new Date(date + 'T12:00:00'),
      time,
      _id: { $ne: id }
    });
    if (existing) return res.status(400).json({ msg: 'Horário indisponível' });

    // Atualiza CEP e endereço se mudou
    let address = appointment.address;
    let city = appointment.city;
    if (cep && cep !== appointment.cep) {
      const cepRes = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (!cepRes.data.erro) {
        address = `${cepRes.data.logradouro}, ${cepRes.data.bairro}, ${cepRes.data.localidade} - ${cepRes.data.uf}`;
        city = cepRes.data.localidade;
      }
    }

    // Atualiza alerta de clima
    let weatherAlert = appointment.weatherAlert;
    if (city) {
      try {
        const weatherRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric&lang=pt_br`
        );
        const list = weatherRes.data.list;
        const dayForecasts = list.filter(item => item.dt_txt.startsWith(date));

        const hasRain = dayForecasts.some(item =>
          item.weather[0].main === 'Rain' || item.pop > 0.5
        );

        weatherAlert = hasRain
          ? '⚠️ ALERTA: Previsão de chuva no dia da consulta!'
          : '🌤️ Tempo bom previsto para o dia.';
      } catch (e) {
        weatherAlert = 'Não foi possível verificar o clima';
      }
    }

    // Atualiza os campos - corrige fuso horário
    appointment.date = new Date(date + 'T12:00:00'); // Força meio-dia local
    appointment.time = time;
    appointment.reason = reason;
    appointment.cep = cep || appointment.cep;
    appointment.address = address;
    appointment.city = city;
    appointment.weatherAlert = weatherAlert;

    await appointment.save();

    res.json({ msg: 'Consulta atualizada com sucesso!', appointment });
  } catch (err) {
    console.error('Erro ao atualizar consulta:', err);
    res.status(500).json({ msg: 'Erro ao atualizar consulta' });
  }
};