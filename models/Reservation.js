const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
  terrain: {
    type: String,
    enum: ['Robecq', 'Calonne', 'StVenant'],
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reservationDate: {
    type: Date,
    required: true
  },
  reservationTime: {
    type: String,
    required: true
  }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
