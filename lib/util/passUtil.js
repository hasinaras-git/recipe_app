const crypto = require('crypto');

const passwordGenerator = (password) => {
  var salt = crypto.randomBytes(32).toString('hex');
  var hashGenerated = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

  return {
    salt,
    hash: hashGenerated
  };
}

const validPassword = (password, hash, salt) => {
  let hashVerify = crypto.pbkdf2(password, salt, 10000, 64, 'sha512');
  return hash === hashVerify;
}

module.exports = { passwordGenerator, validPassword };
