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
},
{
    id: 3,
    description: "Buy eggs",
    completed: true
}];

app.get('/', function(req, res){
    res.send('Todo API root');
});

//get request /todos
app.get('/todos', function(req, res){
    res.json(todos);
});

//todos/:id
app.get('/todos/:id', function(req, res){
    var todoID = req.params.id;
    //iterate over todos array. Find the match.
    todos.forEach(function(todo){
        if(todo.id == todoID){
            res.send(todo);
        }
    })
    res.status(404).send();
});

app.listen(PORT, function(){
    console.log("Listening on port " + PORT + "...");
});
