let mongoose = require('mongoose');
const OId = mongoose.Schema.Types.ObjectId;

let PollSchema = new mongoose.Schema({
  title: {
    type: String,
    index: { unique: true }
  },
  author: OId,
  originPolls: [String],
  othersPolls: [{ content: String, author: OId }]
});

module.exports = mongoose.model('Poll', PollSchema);