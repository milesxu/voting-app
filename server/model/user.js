let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let UserSchema = new mongoose.Schema({
  name: String,
  kind: String,
  email: {
    type: String,
    index: { unique: true }
  },
  password: String,
  token: String
});

UserSchema.methods.comparePassword = function(password, callback) {
  bcrypt.compare(password, this.password, callback);
}

UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  bcrypt.hash(this.password, 10).then(result => {
    this.password = result;
    next();
  }).catch(err => next(err));
});

module.exports = mongoose.model('User', UserSchema);