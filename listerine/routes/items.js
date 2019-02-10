
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
  let oggetto = {
    name: req.body.name,
    status: req.body.status,
  };

  mongooseStuff.ItemsList.create(oggetto).then(signature => {
    res.json(signature)
  })
      .catch(err => {
        console.log(err);
  });
});


module.exports = router;
