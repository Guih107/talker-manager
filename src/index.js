const express = require('express');
const fileReading = require('./utils/reading');

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

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
