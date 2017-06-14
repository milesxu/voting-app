let mongoose = require('mongoose');
const OId = mongoose.Schema.Types.ObjectId;

let VoteRecordSchema = new mongoose.Schema({
    pollId: OId,
    numRecords: [Number]
});

module.exports = mongoose.model('VoteRecord', VoteRecordSchema);