const express = require('express');
const crypto = require('crypto');
const fileReading = require('./utils/reading');
const validateLogin = require('./utils/validationLogin');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

app.get('/talker', async (req, res) => {
  try {
    const talker = await fileReading();
    if (talker.length === 0) {
    return res
    .status(HTTP_OK_STATUS).json([]);
    }
    return res.status(HTTP_OK_STATUS).json(talker);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

app.get('/talker/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const talkers = await fileReading();
    const talkerById = talkers.find((talker) => talker.id === parseInt(id, 10));
    if (!talkerById) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    return res.status(HTTP_OK_STATUS).json(talkerById);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

app.post('/login', validateLogin, (req, res) => {
  try {
    const tokenRandom = crypto.randomBytes(8).toString('hex');
    return res.status(HTTP_OK_STATUS).json({ token: tokenRandom });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  // return res.status(HTTP_OK_STATUS).json({ token: tokenRandom });
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
