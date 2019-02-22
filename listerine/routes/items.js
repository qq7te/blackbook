
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


router.put("/api/items/:id", (req, res) => {
    console.log("here");
    // Validate Request
    // if (!req.body.content) {
    //     return res.status(400).send({
    //         message: "item content can not be empty"
    //     });
    // }
    console.log('good so far');
    // Find note and update it with the request body
    mongooseStuff.ItemsList.findByIdAndUpdate(req.params.id, {
        name: req.body.name || "Untitled Note",
        status: req.body.status
    }, {new: true})
        .then(item => {
            if (!item) {
                return res.status(404).send({
                    message: "Item not found with id " + req.params.id
                });
            }
            res.send(item);
        }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Item not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Error updating item with id " + req.params.id
        });
    });
});

module.exports = router;
