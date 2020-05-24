
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
    // Find note and update it with the request body containing the modifiers
    mongooseStuff.ItemsList.findByIdAndUpdate(req.params.id, req.body,{new: true})
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

// Delete an item with the specified id in the request
router.delete("/api/items/:id", (req, res) => {
    mongooseStuff.ItemsList.findByIdAndRemove(req.params.id)
    .then(item => {
        if(!item) {
            return res.status(404).send({
                message: "Item not found with id " + req.params.id
            });
        }
        res.send({message: "Item deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Item not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Could not delete item with id " + req.params.id
        });
    });
});

module.exports = router;
