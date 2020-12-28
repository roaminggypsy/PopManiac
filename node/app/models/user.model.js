const mongoose = require('mongoose');

const User = mongoose.model(
  'User',
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    roles: [
      {
        // Reference Data Models or Normalization
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
      },
    ],
  })
);

module.exports = User;
