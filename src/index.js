const express = require('express');
const crypto = require('crypto');
const fileReading = require('./utils/reading');
const fileWriting = require('./utils/writing');
const validateLogin = require('./utils/validationLogin');
const authValidation = require('./utils/validateAutorization');
const { valadateName, validateAge, validateTalk,
validateTalkRate, validateWatchedAt } = require('./utils/validateCad');
const { deleteTalker } = require('./utils/delet');

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
});

app.post('/talker', 
  authValidation,
  valadateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateTalkRate,
  async (req, res) => {
  try {
    const { name, age, talk } = req.body;
    const talkers = await fileReading();
    const newTalker = {
      id: talkers.length + 1,
      name,
      age,
      talk,
    };
    talkers.push(newTalker);
    await fileWriting([newTalker]);
    return res.status(201).json(newTalker);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.put('/talker/:id', authValidation, valadateName, validateAge, validateTalk,
  validateWatchedAt,
  validateTalkRate,
async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const talkers = await fileReading();
  const talkerById = talkers.find((talker) => talker.id === parseInt(id, 10));
  if (!talkerById) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  const newTalker = {
    id: parseInt(id, 10), name, age, talk };
  const newTalkers = talkers.map((talker) => {
    if (talker.id === parseInt(id, 10)) {
      return newTalker;
    }
    return talker;
  });
  await fileWriting(newTalkers);
  return res.status(HTTP_OK_STATUS).json(newTalker);
});

app.delete('/talker/:id', authValidation, async (req, res) => {
 const { id } = req.params;
 try {
  await deleteTalker(id);
  return res.status(204).json({ message: 'Talker deletado com sucesso' });
 } catch (err) {
  return res.status(500).json({ message: err.message });
 }
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
