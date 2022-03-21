"use strict";

var courses = [
  {
    title: "Event Driven Cakes",
    cost: 50
  },
  {
    title: "Asynchronous Artichoke",
    cost: 25
  },
  {
    title: "Object Oriented Orange Juice",
    cost: 10
  }
];

exports.showCourses = (req, res) => {
  res.render("courses", {
    offeredCourses: courses
  });
};

module.exports = {
  getSubscriptionPage: (req, res) => {
    res.render('contact');
  },

  index: (req, res) => {
    res.render('index');
  },

  logRequestPaths: (req, res, next) => {
    console.log('request made to:' + req.url);
    next();
  },

  showCourses: (req, res) => {
    res.render("courses", {
      offeredCourses: courses
    });
  }
}


// exports.index = (req, res) => {
//   res.render('index');
// }
//
// exports.logRequestPaths = (req, res, next) => {
//   console.log(`request made to: ${req.url}`);
//   next();
// };
//
// exports.showSigndUp = (req, res) => {
//   res.render('contact');
// }
//
// exports.postedContactForm = (req, res) => {
//   res.render('thanks');
// }
//
//
//
// exports.sendReqParam = (req, res) => {
//   let veg = req.params.vegetable;
//   res.send(`This is the page for ${veg}`);
// };
//
// exports.respondWithName = (req, res) => {
//   res.render("index");
// };
