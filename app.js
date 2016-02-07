var express = require('express');
var bodyParser = require('body-parser');
var app = express();
//process.env.PORT provided by heroku
var PORT = process.env.PORT || 3000;
var todos = [];

var todoNextId = 1;

app.use(bodyParser.json());

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

// post /todos
app.post('/todos', function(req, res){
    var body = req.body;
    todos.push({
        "id": todoNextId,
        "description": body.description,
        "completed": body.completed
    });
    todoNextId++;
    console.log('description: ' + body.description);

    res.json(body);
});

app.listen(PORT, function(){
    console.log("Listening on port " + PORT + "...");
});
