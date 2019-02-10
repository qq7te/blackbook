const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const listSchema = new Schema({
  name: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  status: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});


const ItemsList = mongoose.model('items', listSchema);

module.exports = {ItemsList, mongoose};