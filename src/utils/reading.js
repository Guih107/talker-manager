const fs = require('fs').promises;
const path = require('path');

const talker = path.resolve('src', 'talker.json');

const fileReading = async () => {
  try {
    const file = await fs.readFile(talker, 'utf-8');
    return JSON.parse(file);
  } catch (err) {
    return console.log(err, 'Erro ao ler o arquivo: arquivo não encontrado');
  }
};

module.exports = fileReading;