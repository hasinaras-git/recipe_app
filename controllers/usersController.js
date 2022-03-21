const User = require('../models/user');
const passport = require('passport');
const passUtil = require('../lib/util/passUtil');

module.exports = {
  index: (req, res, next) => {
    User.find({})
      .then((users) => {
        res.locals.users = users;
        next()
      }).catch(err => {
        console.log(`Error fetching users: ${err.message}`);
        next(err);
      })
  },

  indexView: (req, res) => {
    res.render('users/index');
  },

  new: (req, res) => {
    res.render('users/new');
  },

  validate: (req, res, next) => {
    req.sanitizeBody('email').normalizeEmail({
      all_lowercase: true
    }).trim();
    req.check('email', 'Email is invalid').isEmail();
    req.check('zipCode',"Zip code is invalid").notEmpty()
      .isInt().isLength({min: 5, max: 5})
      .equals(req.body.zipCode);

      req.getValidationResult().then(error => {
        if(!error.isEmpty()) {
          let message = error.array().map(e => e.msg);
          req.skip = true;
          req.flash('error', message.join(' and '));
          res.locals.redirect = "/users/new";
          next();
        } else {
          next();
        }
      })
  },

  create: (req, res, next) => {
    if(req.skip) next();
    let userParams = {
      name: {
        first: req.body.first,
        last: req.body.last
      },
      email: req.body.email,
      zipCode: req.body.zipCode
    };

    // let pass = passUtil.passwordGenerator(req.body.password);
    // userParams.hash = pass.hash;
    // userParams.salt = pass.salt;
    // console.log(userParams);
    // User.create(userParams).then(user => {
    //   req.flash('success', `${user.fullname}'s account created'`);
    //   res.locals.redirect = '/users';
    //   console.log(user);
    //   next();
    // }).catch(err => {
    //   req.flash('error', 'Failed to create account');
    //   res.locals.redirect = '/users/new';
    //   console.log(err.message);
    //   next(err);
    // })

    User.register(userParams, req.body.password, (error, user) => {
      if(user) {
        req.flash('success', `${user.fullname}'s account created`);
        res.locals.redirect = "/users";
        next();
      } else {
        req.flash("error", "Failed to create user account: "
         + error.message);
         res.locals.redirect = "/users/new";
         next();
      }
    });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if(redirectPath) res.redirect(redirectPath)
    else next()
  },

  show: async (req, res, next) => {
    let userId = req.params.id;
    // User.findById(userId)
    //   .then((user) => {
    //     res.locals.user = user;
    //     next();
    //   }).catch((err) => {
    //     console.log(`Error when searching user ${err.message}`);
    //     next(err);
    //   });
    try {
      const user = await User.findById(userId);
      res.locals.user = user;
      next();
    } catch(err) {
      console.log(`Error when searching user ${err.message}`);
      next(err);
    }
  },

  showView: (req, res) => {
    res.render('users/show');
  },

  edit: (req, res, next) => {
    let userId = req.params.id;
    const findRender = async () => {
      try {
        const user = await User.findById(userId);
        res.render("users/edit", {user: user});
      }catch(err) {
        console.log(`error fetching user by ID: ${err.message}`);
        next(err);
      }
    }
    findRender();
  },

  update: (req, res, next) => {
    let userId = req.params.id_hex;
    let userParams = {
      name: {
        first: req.body.firstName,
        last: req.body.lastName
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode
    };
    User.findByIdAndUpdate(userId, {$set: userParams})
      .then(user => {
        res.locals.redirect = `/users/${userId}`;
        res.locals.user = user;
        next();
      }).catch(err => {
        console.log(`Error updating user by Id: ${err.message}`);
        next(err);
      })
  },

  delete: (req, res, next) => {
    let userParams = req.params.id;
    const fetchAndDelete = async () => {
      try {
        const result = await User.findByIdAndRemove(userParams);
        res.locals.redirect = `/users`;
        next();
      }catch(err) {
        console.log(`Error fetching user by ID: ${err.message}`);
        next(err);
      }
    }
    fetchAndDelete();
  },

  login: (req, res) => {
    res.render('users/login');
  },

  logout: (req, res, next) => {
    req.logout();
    res.redirect('/');
    next();
  },

  authenticate: passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: 'Failed to login',
    successRedirect: '/',
    successFlash: 'logged in'
  })

  // authenticate: (req, res, next) => {
  //
  //   // User.findOne({email: req.body.email})
  //   //   .then(user => {
  //   //     if(user) {
  //   //       user.passwordComparison(req.body.password)
  //   //         .then(passwordMatch => {
  //   //           console.log(passwordMatch + ' :: ' + req.body.password);
  //   //
  //   //           if(passwordMatch){
  //   //             req.flash('success', 'You are conneced');
  //   //             res.locals.redirect = `/users/${user._id}`;
  //   //             res.locals.user = user;
  //   //           } else {
  //   //             req.flash('error', 'Please, verify your password');
  //   //             res.locals.redirect = ('/users/login');
  //   //           }
  //   //           next();
  //   //         })
  //   //    } else {
  //   //      req.flash('error', 'user not found');
  //   //      res.locals.redirect = `/users/login`;
  //   //      next();
  //   //    }
  //   //  }).catch(err => {
  //   //    console.log(`error loggin in user: ${err.message}`);
  //   //    next(err);
  //   //  })
  //  }
}
