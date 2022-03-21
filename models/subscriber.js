"use strict";

const mongoose = require("mongoose");
const courses = require('./course');
const subscriberSchema = mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      uniqure: true
    },
    zipCode: {
      type: Number,
      min:[10000, "Zip Code is too short"],
      max: 99999
    },
    courses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    }]
  }
);

//add instance method
subscriberSchema.methods.getInfo = function() {
  return `Name: ${this.name} Email: ${this.email} ZipCode: ${this.zipCode}`;
}

subscriberSchema.methods.findLocalSubscriber = function() {
  return this.model("Subscriber")
    .find({zipCode: this.zipCode})
    .exec()
}

module.exports = mongoose.model("Subscriber", subscriberSchema);
