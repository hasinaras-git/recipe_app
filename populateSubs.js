const mongoose = require('mongoose');
const Subscriber = require('./models/subscriber');
const Course = require('./models/course');

mongoose.connect('mongodb://localhost:27017/recipe_db', {
  useNewUrlParser: true
});

mongoose.Promise = global.Promise;

let user_info = [
  {
    name: "Rakoto",
    email: "rakoto@email.com",
    zipCode: 55596
  },
  {
    name: "Randria",
    email: "randri@email.com",
    zipCode: 55597
  },
  {
    name: "Ramaro",
    email: "ramaro@email.com",
    zipCode: 55598
  },
  {
    name: "Rason",
    email: "rason@email.com",
    zipCode: 55599
  },
  {
    name: "Ramala",
    email: "ramal@email.com",
    zipCode: 55600
  },
  {
    name: "Rasoa",
    email: "rasoa@email.com",
    zipCode: 55601
  },
  {
    name: "Rajo",
    email: "rajo@email.com",
    zipCode: 55602
  }
];

let courses = [
  {
    title: "Pizza",
    desciption: "Pizza without meal"
  },
  {
    title: "Bread",
    desciption: "Simple bread that you can do at home"
  },
  {
    title: "Biscuit",
    desciption: "Delicious for kids"
  }
];

//create subscribers
// user_info.forEach((user) => {
//   Subscriber.create({
//     name: user.name,
//     email: user.email,
//     zipCode: user.zipCode
//   })
// })

// //create courses
// courses.forEach((course) => {
//   Course.create({
//     title: course.title,
//     desciption: course.description
//   })
// })


const randTitle =  () => {
  return courses[parseInt((Math.random() * 10) % 3)].title;
}

let subscriber, course;

// user_info.forEach((user) => {
//   Subscriber.findOne({
//     name: user.name
//   }).then(s => {
//     //console.log(s)
//     subscriber = s
//   })
//     .then(() => Course.findOne({title: randTitle()}))
//     .then((crs) => {
//       //console.log(crs)
//       subscriber.courses.push(crs)
//     })
//     .then(() => subscriber.save())
//     .then(() => Subscriber.populate(subscriber, "courses"))
//     .then((sub) => console.log(sub))
// })

Subscriber.findOne({
  name: "Rajo"
}).then(res => {
  subscriber = res;
}) .then(() => {
  Course.findOne({
    title: courses[2].title
  }).then((res) => {
    subscriber.courses.push(res);
  }).then(() => subscriber.save())
    .then(() => Subscriber.populate(subscriber, "courses"))
    .then((sub) => console.log(sub))
})

// Subscriber.findOne({
//   name: "Randria"
// }).then(res => {
//   subscriber = res;
// }) .then(() => {
//   Course.findOne({
//     title: courses[1].title
//   }).then((res) => {
//     subscriber.courses.push(res);
//   }).then(() => subscriber.save())
//     .then(() => Subscriber.populate(subscriber, "courses"))
//     .then((sub) => console.log(sub))
// })
