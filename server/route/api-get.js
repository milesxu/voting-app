const express = require('express');
const Poll = require('mongoose').model('Poll');
const VoteRecord = require('mongoose').model('VoteRecord');

const router = express.Router();

router.get('/', (req, res, next) => {
  if (req.query.title) {
    const pattern = `^${req.query.title}`;
    Poll.findOne({ title: { $regex: pattern } }).then(poll => {
      let polls = poll.originPolls;
      if (poll.othersPolls.length)
        poll.othersPolls.forEach(p => polls.push(p.content));
      res.json({
        title: poll.title,
        polls
      });
    })
      .catch(err => res.status(500).json({
        success: false,
        message: 'Database operation fail.'
      }));
  } else {
    Poll.aggregate()
      .lookup({
        from: 'voterecords',
        localField: '_id',
        foreignField: 'pollId',
        as: 'records'
      }).project({
        title: 1,
        _id: 0,
        record: '$records.numRecords'
      }).unwind('$record')
      .project({
        title: 1,
        votes: {
          $sum: '$record'
        }
      }).then(polls => {
        res.status(200).json({
          success: true,
          polls
        });
      }).catch(err => res.status(500).json({
        success: false,
        message: 'Database operation fail.'
      }));
  }
});

router.get('/aggregate', (req, res, next) => {
  const query = { title: { $regex: `^${req.query.title}` } };
  Poll.findOne(query).then(poll => {
    VoteRecord.findOne({ pollId: poll.id }).then(record => {
      const arr = poll.originPolls.concat(poll.othersPolls);
      let records;
      if (!record) {
        records = new Array(arr.length);
        records.fill(0);
        const rcd = new VoteRecord({
          pollId: poll.id,
          numRecords: records
        });
        rcd.save().then(r => console.log('new records created'));
      } else
        records = record.numRecords;
      res.json({
        title: poll.title,
        options: arr,
        record: records
      });
    });
  }).catch(err => res.status(500).json({
    success: false,
    message: 'Database operation fail.'
  }));
});
module.exports = router;
