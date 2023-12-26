const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Pleas Enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail,'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Pleas Enter an password'],
    minlength: [6,'Minimum length is 6'],
  }
});

// before doc saved to db
userSchema.pre('save', async function(next) {
    // console.log('user about to be created',this);
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next();
});

// login method
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password,user.password)
    if(auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
}

const User = mongoose.model('user', userSchema);

module.exports = User;