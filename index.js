//set up
var express = require('express')
var app = express();
var bodyParser = require('body-parser')
var database = null;

//If a client asks for a file,
//look in the public folder. If it's there, give it to them.
app.use(express.static(__dirname + '/public'));

//this lets us read POST data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//make an empty list of ideas
var coolIdeas = [];
var idea = {};
idea.text = "Two cats who solve crimes in Dunedin";
idea.time =  new Date();
coolIdeas.push(idea);

//let a client GET the list of ideas
var sendIdeasList = function (request, response) {
  response.send(coolIdeas);
}
app.get('/ideas', sendIdeasList);

//let a client GET comments
var sendComments = function (request, response) {
  response.send(coolComments);
}
app.get('/comments', sendComments);

//let a client POST new ideas
var saveNewIdea = function (request, response) {
  console.log(request.body.idea);
  console.log(request.body.author); //write it on the command prompt so we can see
  var idea = {};
  idea.text = request.body.idea;
  if (request.body.url===""){
    idea.url = "images/UploadImage.png";
  } else {
      idea.url = request.body.url;
  }
  idea.time =  new Date();
  idea.author = request.body.author;
  idea.id = Math.round(Math.random() * 10000);
  coolIdeas.push(idea); //save it in our list
  response.send("Thanks for your idea. Please don't do it again");
  var dbPosts = database.collection('posts');
  dbPosts.insert(idea);
}
app.post('/ideas', saveNewIdea);

app.get('/idea', function (req, res) {
   var searchId = req.query.id;
   console.log("Searching for post " + searchId);
   var results = coolIdeas.filter(function (post) { return post.id == searchId; });
   if (results.length > 0) {
     res.send(results[0]);
   } else {
   res.send(null);
   }
});

var saveNewComment = function (request, response) {
  console.log(request.body.comment);
var newComment = {}
  newComment.id = request.body.id;
  newComment.comment = request.body.comment;
}
app.post('/comments', saveNewComment);

//listen for connections on port 3000
app.listen(process.env.PORT || 3000);
console.log("I am listening...");
console.log("added for no reason");
var mongodb = require('mongodb');
var uri = 'mongodb://user:password@ds015919.mlab.com:15919/girlcode16t1';
mongodb.MongoClient.connect(uri, function(err, newdb) {
  if(err) throw err;
  console.log("Connected to the database");
  database = newdb;
  var dbPosts = database.collection('posts');
  dbPosts.find(function (err, cursor) {
    cursor.each(function (err, item) {
      if (item != null) {
        coolIdeas.push(item);
      }
    });
  });
});
