const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rapportSchema = new Schema({
  reservation: {
    type: Schema.Types.ObjectId,
    ref: 'Reservation',
    required: true
  },
  dateRapport: {
    type: Date,
    default: Date.now
  },
  observations: {
    type: String,
    default: ''
  },
});

const Rapport = mongoose.model('Rapport', rapportSchema);

module.exports = Rapport;
