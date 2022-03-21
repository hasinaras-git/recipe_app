const mongoose = require('mongoose');
const Subscriber = require('./subscriber');
const { Schema } = mongoose;
const crypto = require('crypto');
const passUtil = require('../lib/util/passUtil');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  name: {
    first: {
      type: String,
      trim: true
    },
    last: {
      type: String,
      trim: true
    }
  },

  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },

  zipCode: {
    type: Number,
    min:[10000, "Zip code too short"],
    max: 99999
  },

  courses: [{type: mongoose.Schema.Types.ObjectId, ref: "Course"}],
  subscribedAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscriber"
  },
}, {timestamp: true});

//creating virtual attribute
userSchema.virtual("fullname").get(function() {
  return `${this.name.first} ${this.name.last}`;
});

//adding a hook(Mongoose middleware)
userSchema.pre('save', function(next) {
  let user = this;
  if(user.subscribedAccount === undefined) {
    Subscriber.findOne({
      email: user.email
    }).then((subscriber) => {
      user.subscribedAccount = subscriber;
      next();
    }).catch(err => console.log(`Error in connecting subscriber ${err.message}`))
  } else {
    next();
  }
})

// userSchema.pre('save', function(next) {
//   let user = this;
//   bcrypt.hash(user.password, 10)
//     .then(hash => {
//       user.password = hash;
//       next();
//     }).catch(err => {
//       console.log(`Error in hashing password ${err.message}`);
//       next(err);
//     })
// })

userSchema.pre('save', async (next) => {
  try {
    const user = this;
    const pass = await passUtil.passwordGenerator(user.password);
    user.hash = pass.hashGenerated;
    user.salt = pass.salt;
  } catch(err) {
    console.log(err.message);
  }
})

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});
//
// userSchema.methods.passwordComparison = function(inputPassword) {
//   let user = this;
//   return bcrypt.compare(inputPassword, user.password);
// }

module.exports = mongoose.model("User", userSchema);
