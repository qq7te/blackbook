
var express = require('express');
var router = express.Router();
const mongooseStuff = require('./../noidea.js');

// const ItemsList = mongooseStuff.ItemsList;

router.get('/api/items', function(req, res) {
  mongooseStuff.ItemsList.find({}).then(eachOne => {
    res.json(eachOne);
    })
  });


router.post('/api/items', function(req, res) {
  mongooseStuff.ItemsList.create({
    guestSignature: req.body.name,
    message: req.body.status,
  }).then(signature => {
    res.json(signature)
  });
});


module.exports = router;
