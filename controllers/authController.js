const User = require("../models/User");
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };
  
    // incorrect email
    if (err.message === 'incorrect email') {
      errors.email = 'That email is not registered';
    }
  
    // incorrect password
    if (err.message === 'incorrect password') {
      errors.password = 'That password is incorrect';
    }
  
    // duplicate email error
    if (err.code === 11000) {
      errors.email = 'that email is already registered';
      return errors;
    }
  
    // validation errors
    if (err.message.includes('user validation failed')) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
  }

// 
const maxAge = 1*24*60*60;

const createToken = (id) => {
    return jwt.sign( { id }, 'mysecret', { expiresIn: maxAge });
}

// controller
const signup_get = (req,res) => {
    res.render('signup',{ title: 'Sign Up'});
}

const login_get = (req,res) => {
    res.render('login.ejs',{ title: 'Login'});
}

const signup_post = async (req,res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.create({ email, password})
        const token = createToken(user._id);
        res.cookie('jwt',token, { httpOnly: true, maxAge: maxAge*1000});
        res.status(201).json({user: user._id});
    }
    catch( err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

const login_post = async (req,res) => {
    const { email, password} = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });   
    }
}

const logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1});
  res.redirect('/');
}

module.exports = {
    signup_get,
    signup_post,
    login_get,
    login_post,
    logout_get
}
