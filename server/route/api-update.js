const express = require('express');
const authCheck = require('../auth-check');
const Poll = require('mongoose').model('Poll');
const VoteRecord = require('mongoose').model('VoteRecord');
const User = require('mongoose').model('User');
const { getSign } = require('../passport/util');

const router = express.Router();

router.use(authCheck);

router.post('/new', (req, res, next) => {
  //console.log(req.body);
  const newPoll = new Poll({
    title: req.body.title,
    author: req.body.decoded.sub,
  });
  req.body.polls.forEach(p => newPoll.originPolls.push(p));
  //console.log(newPoll);
  newPoll.save().then(p => {
    let arr = new Array(p.originPolls.length + p.othersPolls.length);
    arr.fill(0);
    const newRecord = new VoteRecord({
      pollId: p.id,
      numRecords: arr
    });
    return newRecord.save();
  }).then(() => res.status(200).json({
    success: true,
    message: 'New Poll is successfully created!',
    poll: ''
  })).catch(err =>
    res.status(500).json({
      success: false,
      message: 'Database operation error, please retry.'
    }));
});

router.post('/vote', (req, res, next) => {
  const query = {
    title: { $regex: `^${req.body.title}` }
  };
  if (req.body.option) {
    Poll.findOneAndUpdate(query, {
      $push: {
        othersPolls: {
          content: req.body.option,
          author: req.body.decoded.sub
        }
      }
    }).then(poll => {
      VoteRecord.findOne({ pollId: poll.id }).then(record => {
        if (record) {
          VoteRecord.findOneAndUpdate({ pollId: poll.id }, {
            $push: { numRecords: 1 }
          }).then(() => res.status(200).json({
            success: true,
            message: 'Voting information submitted successfully.'
          }));
        } else {
          let arr = new Array(poll.originPolls.length);
          arr.fill(0);
          arr.push(1);
          const newRecord = new VoteRecord({
            pollId: poll.id,
            numRecords: arr
          });
          newRecord.save().then(() => res.status(200).json({
            success: true,
            message: 'Voting information submitted successfully.'
          }));
        }
      })
    }).catch(err => res.status(500).json({
      success: false,
      message: 'Database operation error, please retry.'
    }));
  } else if (req.body.value) {
    Poll.findOne(query).then(poll => {
      VoteRecord.findOne({ pollId: poll.id }).then(record => {
        if (record) {
          let arr = record.numRecords;
          arr[req.body.value] += 1;
          VoteRecord.findOneAndUpdate({ pollId: poll.id }, {
            $set: { numRecords: arr }
          }).then(() => res.status(200).json({
            success: true,
            message: 'Voting information submitted successfully.'
          }));
        } else {
          let arr = new Array(poll.originPolls.length);
          arr.fill(0);
          arr[req.body.value] = 1;
          const newRecord = new VoteRecord({
            pollId: poll.id,
            numRecords: arr
          });
          newRecord.save().then(() => res.status(200).json({
            success: true,
            message: 'Voting information submitted successfully.'
          }));
        }
      });
    }).catch(err => res.status(500).json({
      success: false,
      message: 'Database operation fail.'
    }));
  }
});

router.get('/refresh', (req, res) => {
  User.findById(req.body.decoded.sub).then(usr => {
    if (!usr)
      return res.status(500).json({
        success: false,
        message: 'Database internal error'
      });

    const cur = Math.floor(new Date().getTime() / 1000);
    if (req.body.decoded.exp - cur > 600)
      return res.json({
        notneed: true,
        user: usr.name
      });

    getSign(usr, (err, token, data) => {
      res.json({
        token,
        user: data.name
      });
    });
  }).catch(err => {
    res.status(500).json({
      success: false,
      message: 'Database internal error'
    });
  });
});

router.get('/mypoll', (req, res) => {
  Poll.find({ author: req.body.decoded.sub }).then(polls => {
    const data = polls.map(p => p.title);
    res.json({
      success: true,
      titles: data
    });
  }).catch(err => {
    res.status(500).json({
      success: false,
      message: 'Database internal error'
    });
  });
});

router.delete('/', (req, res) => {
  if (!req.query.title)
    return res.status(404).json({
      success: false,
      message: 'bad request'
    });
  const query = { title: { $regex: `^${req.query.title}` } };
  //res.json({ query });
  Poll.findOneAndRemove(query).then(poll => {
    //console.log(query);
    //console.log(poll);
    res.json({
      success: true,
      message: 'Entry is successfully deleted.'
    });
  }).catch(err => res.status(500).json({
    success: false,
    message: 'Database internal error.'
  }));
});

module.exports = router;