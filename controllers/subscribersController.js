const mongoose = require('mongoose');
const Subscriber = require('../models/subscriber');

module.exports = {
  index: (req, res, next) => {
    Subscriber.find({})
      .then(subscribers => {
        res.locals.subscribers = subscribers;
        next();
      })
      .catch(error => {
        console.log(`Error fetching subscribers: ${error.message}`);
        next(error);
      });
  },

  saveSubscriber: (req, res) => {
    let newSubscriber = new Subscriber({
      name: req.body.name,
      email: req.body.email,
      zipCode: req.body.zipCode
    })
    newSubscriber.save((error, result) => {
      req.flash('success', `${newSubscriber.name} successfully saved`);
      if(error){
        req.flash('error', `Error saving ${subscriber.name}: ${err.message}`);
        res.send(error);
      }
      res.render('thanks');
    })
  },

  getSubscriptionPage: (req, res) => {
    res.render('contact');
  },


}
