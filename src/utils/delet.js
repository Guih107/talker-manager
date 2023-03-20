const fileReading = require('./reading');
const fileWriting = require('./writing');

const deleteTalker = async (id) => {
    const talkers = await fileReading();
    const deletTalker = talkers.find((talker) => talker.id === +id);
    if (!deletTalker) {
      return;
    }
    const talker = talkers.filter((element) => element.id !== +id);
    await fileWriting(talker);
};

module.exports = {
  deleteTalker,
}; 