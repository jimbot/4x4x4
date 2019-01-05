var express = require('express');
var app = express();

// 'public' stores our css files
app.set("view engine", "ejs");
app.use(express.static("public"));

// Links
app.get("/", function(req, res){
  res.render("index");
});

app.get("/public-game", function(req, res){
  res.render("publicGame");
});

app.get("/private-game", function(req, res){
  res.render("privateGame");
});

app.get("/how-to-play", function(req, res){
  res.render("howToPlay");
});

// LISTENERS
// HEROKU
app.listen(process.env.PORT || 5000, function(){
  console.log("Heroku server updated.");
});
// LOCALHOST
app.listen(3000, function(){
  console.log("listening on port 3000");
});
