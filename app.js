var express = require('express');
var app = express();
//process.env.PORT provided by heroku
var PORT = process.env.PORT || 3000;
var todos = [{
    id: 1,
    description: "Go for lunch",
    completed: false
},
{
    id: 2,
    description: "Go to market",
    completed: false
}];

app.get('/', function(req, res){
    res.send('Todo API root');
});

//get request /todos
app.get('/todos', function(req, res){
    res.json(todos);
});

//todos/:id
//app.get('')

app.listen(PORT, function(){
    console.log("Listening on port " + PORT + "...");
});
