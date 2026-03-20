const axios = require('axios');

exports.getAddress = async (req, res) => {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${req.params.cep}/json/`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao consultar CEP' });
  }
};