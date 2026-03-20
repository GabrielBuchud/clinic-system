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
    const existing = await Appointment.findOne({ date: new Date(date), time });
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

    // Consulta clima (OpenWeatherMap)
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
      date: new Date(date),
      time,
      reason,
      address,
      city,
      weatherAlert
    });

    await appointment.save();
    res.json({ msg: 'Consulta agendada com sucesso!', appointment });
  } catch (err) {
    console.error(err);
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
    res.status(500).json({ msg: 'Erro ao buscar agendamentos' });
  }
};

exports.delete = async (req, res) => {
  if (req.user.role !== 'secretary') return res.status(403).json({ msg: 'Acesso negado' });
  await Appointment.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Agendamento excluído' });
};