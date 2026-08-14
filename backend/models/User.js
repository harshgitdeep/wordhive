const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const UserSchema = new Schema({
  username: {type: String, required: true, min: 4, unique: true},
  name: {type: String, default: ''},
  password: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  bio: {type: String, default: 'Passionate writer & reader on WordHive.'},
});

const UserModel = mongoose.models.User || model('User', UserSchema);

module.exports = UserModel;