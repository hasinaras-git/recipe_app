const LocalStrategy = require('passport-local');
const User = require('../../models/user');
const passUtil = require('../util/passUtil');

const verify = async (username, password, done) => {
  try {
    const user = await User.findOne({username: username});
    console.log(user);
    if(!user) return done(null, false);
    const isValid = passUtil.validPassword(password, user.hash, user.salt);
    if(!isValid) return done(null, false);
    return done(null, user);
  } catch(err) {
    done(err);
  }
}

const strategy = new LocalStrategy(verify);
module.exports = strategy;
