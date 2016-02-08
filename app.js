var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
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
    var todoID = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoID});

    if (matchedTodo) {
        res.json(matchedTodo);
    }else{
        res.status(404).send();
    }
});

// post /todos
app.post('/todos', function(req, res){
    var body = req.body;
    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
        return res.status(400).send();
    }
    body.description = body.description.trim();
    body.id = todoNextId++;
    body = _.pick(body, 'id', 'description', 'completed');
    todos.push(body);
    res.json(body);

});

app.post('/todos/delete/:id', function(req,res){
    var todoID = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoID});

    if(matchedTodo){
        todos = _.without(todos, matchedTodo);
        res.status(200).send();
    }else{
        res.status(400).send();
    }
});

app.put('/todos/:id', function(req,res){
    var todoID = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoID});
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};

    if(!matchedTodo){
        return res.status(404).send();
    }

    if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
        validAttributes.completed = body.completed;
    }else if(body.hasOwnProperty('completed')){
        return res.status(400).send();
    }

    if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
        validAttributes.description = body.description;
    }else if(body.hasOwnProperty('description')){
        res.status(400).send();
    }

    _.extend(matchedTodo, validAttributes);
    res.status(200).send();
});


app.listen(PORT, function(){
    console.log("Listening on port " + PORT + "...");
});
