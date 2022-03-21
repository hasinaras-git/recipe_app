"use strict";

const express = require("express"),
  subscribersController = require('./controllers/subscribersController'),
  app = express(),
  expressSession = require('express-session'),
  cookieParser = require('cookie-parser'),
  connectFlash = require('connect-flash'),
  passport = require('passport'),
  expressValidator = require("express-validator"),
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  usersController = require('./controllers/usersController'),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
  router = express.Router(),
  methodOverride = require('method-override'),
  User = require('./models/user'),
  Subscriber = require("./models/subscriber"),
  strategy = require('./lib/authentication/strategy'),
  MongoStore = require('connect-mongo');

mongoose.connect(
  "mongodb://localhost:27017/recipe_db",
  { useNewUrlParser: true }
);
mongoose.set("useCreateIndex", true);
const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

var myQuery = Subscriber.findOne({
  name: "Jon Wexler"
}).where("email", /wexler/);

myQuery.exec((error, data) => {
  if (data) console.log(data.name);
});

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

router.use(express.static("public"));
router.use(layouts);
router.use(
  express.urlencoded({
    extended: false
  })
);
router.use(express.json());
router.use(homeController.logRequestPaths);
//use the middleware to override the method
router.use(methodOverride('_method', {
  methods: ["GET", "POST"]
}));

router.use(connectFlash());

router.use(cookieParser('secret-passcode'));
router.use(expressSession({
  secret: 'secret-passcode',
  cookie: {
      maxAge: 400000
  },
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/recipe_session_db',
    collectionName: 'recipe_app_db'
  }),
  resave: false,
  saveUninitialized: false
}));


//*************using passport-locals-mongoose package**********************//
// passport.use(strategy);
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });
// passport.deserializeUser(async (userId, done) => {
//   try {
//     const user = await User.findById(userId);
//     done(null, user);
//   } catch(err) {
//     done(err);
//   }
// });
//
// app.use(passport.initialize());
// app.use(passport.session());


passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
router.use(passport.initialize());
router.use(passport.session());

router.use(expressValidator());


router.use(async(req, res, next) => {
  // count++;
  console.log(req.user);
  res.locals.flashMessage = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  // // console.log('after authentication: ' + req.body.email);
  // // user = await User.findOne({email: req.body.email});
  res.locals.currentUser = req.user;
  next();
})


// app.get("/name", homeController.respondWithName);
// app.get("/items/:vegetable", homeController.sendReqParam);
router.get('/', homeController.index);
router.get("/index", subscribersController.index,
  (req, res, next) => {
    console.log(req.data);
    res.render("index", {subscribers: req.data});
  }
);
router.get('/users', usersController.index, usersController.indexView);
router.get('/courses', homeController.showCourses);
router.get('/contact', subscribersController.getSubscriptionPage);
router.post('/subscribe', subscribersController.saveSubscriber);
router.get('/users/new', usersController.new);
router.get('/users/login', usersController.login);
router.get('/users/logout', usersController.logout);
router.post('/users/login', usersController.authenticate, usersController.redirectView);
router.post('/users/create',  usersController.validate, usersController.create, usersController.redirectView);
router.get('/users/:id', usersController.show, usersController.showView)
router.get('/users/:id/edit', usersController.edit);
router.put('/users/:id_hex/update', usersController.update, usersController.redirectView);
router.delete('/users/:id/delete', usersController.delete, usersController.redirectView);

// app.post("/", (req, res) => {
//   console.log(req.body);
//   console.log(req.query);
//   res.send("POST Successful!");
// });

router.use(errorController.logErrors);
router.use(errorController.respondNoResourceFound);
router.use(errorController.respondInternalError);

//use router object middleware and routing
app.use('/', router);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
