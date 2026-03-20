const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  console.log('1. Requisição recebida:', req.body);

  const { name, email, password, role } = req.body;

  try {
    if (!email || !password) {
      console.log('Campos obrigatórios faltando');
      return res.status(400).json({ msg: 'E-mail e senha obrigatórios' });
    }

    console.log('2. Buscando usuário por email:', email);
    let user = await User.findOne({ email });

    if (user) {
      console.log('3. Usuário já existe');
      return res.status(400).json({ msg: 'Usuário já existe' });
    }

    console.log('4. Criando novo usuário');
    user = new User({ name, email, password, role: role || 'patient' });

    console.log('5. Salvando usuário');
    await user.save();

    console.log('6. Gerando token JWT');
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    console.log('7. Sucesso! Enviando resposta');
    res.json({ token, role: user.role, name: user.name });
  } catch (err) {
    console.error('ERRO NO REGISTER:', err.message);
    console.error('Stack completo:', err.stack);
    res.status(500).json({ msg: 'Erro no servidor', details: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log('LOGIN - Dados recebidos:', { email, password: password ? '***' : 'ausente' });

  if (!email || !password) {
    console.log('LOGIN - Campos faltando');
    return res.status(400).json({ msg: 'E-mail e senha são obrigatórios' });
  }

  try {
    console.log('LOGIN - Buscando usuário por email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('LOGIN - Usuário não encontrado');
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    console.log('LOGIN - Usuário encontrado. Senha armazenada no banco:', user.password);

    // Comparação TEMPORÁRIA de senha PLANA (já que o hash está desativado)
    console.log('LOGIN - Comparando senha plana (temporário)');
    const isMatch = password === user.password;

    console.log('LOGIN - Resultado da comparação:', isMatch);

    if (!isMatch) {
      console.log('LOGIN - Senha incorreta (plana)');
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    console.log('LOGIN - Senha correta, gerando token');
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    console.log('LOGIN - Sucesso total');
    res.json({ token, role: user.role, name: user.name });
  } catch (err) {
    console.error('LOGIN - Erro completo:', err.message);
    console.error(err.stack);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};