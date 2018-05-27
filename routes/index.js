var express = require('express');
var router = express.Router();
let steem = require('../modules/steemconnect')
let config = require('../config')
let util = require('../modules/util')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Utopian'
  });
});

router.get('/dashboard', util.isMod, function(req, res, next) {
  res.render('dashboard');
});

router.post('/vote', util.isMod, async function(req, res, next) {
  let author = req.session.steemconnect.name
  let title = req.body.title
  let tags = req.body.tags
  let permlink = title.replace(/ /g,'-')
  permlink = permlink.toLowerCase()
  console.log(permlink);
  let primaryTag = 'utopian-io'
  let ben = [{
    'account': 'utopian.pay',
    'weight': 500
  }]
  tags = tags.split(' ')
  tags.splice(3)
  let otherTags = ['translation', ...tags]
  let body = req.body.body
  body = body.replace(/\\r\\n/g, "<br />")
  console.log(body);
  console.log(tags);
  console.log(title);
  steem.broadcast([
    ['comment', {
      'parent_author': '',
      'parent_permlink': primaryTag,
      'author': author,
      'permlink': permlink,
      'title': title,
      'body': body,
      'json_metadata': JSON.stringify({
        app: 'utopian.translation/0.0.1',
        tags: [primaryTag, ...otherTags]
      })
    }],
    ['comment_options', {
      'author': author,
      'permlink': permlink,
      'max_accepted_payout': '1000000.000 SBD',
      'percent_steem_dollars': 10000,
      'allow_votes': true,
      'allow_curation_rewards': true,
      'extensions': [
        [0, {
          'beneficiaries': ben
        }]
      ]
    }]
  ], function(err, response) {
    if (err) {
      console.log(err)
      res.redirect('/fail')
    } else {
      res.redirect(`/success`)
    }
  })
})


router.get('/success', util.isMod, function(req, res, next) {
  res.render('success')
})

router.get('/fail', util.isMod, function(req, res, next) {
  res.render('fail')
})

module.exports = router;
