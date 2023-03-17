const fs = require('fs').promises;
const path = require('path');

const talker = path.resolve('src', 'talker.json');

const fileWriting = async (talk) => {
  try {
    await fs.writeFile(talker, JSON.stringify(talk), 'utf-8');
    console.log('Arquivo gravado com sucesso!');
  } catch (err) {
    console.error(err, 'Erro ao gravar o arquivo');
  }
};

module.exports = fileWriting;
