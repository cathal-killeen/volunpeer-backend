var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var app = express();
//process.env.PORT provided by heroku
var PORT = process.env.PORT || 3000;
var todos = [];

var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send('Todo API root');
});

//get request /todos?completed=true  q=search
app.get('/todos', function(req, res){
    var query = req.query;
    var where = {};

    if(query.hasOwnProperty('completed')){
        if(query.completed === 'true'){
            where.completed = true;
        }else if(query.completed = 'false'){
            where.completed = false;
        }
    }

    if(query.hasOwnProperty('q')){
        if(query.q.length > 0){
            where.description = {
                $like: '%' + query.q + '%'
            }
        }
    }

    db.todo.findAll({
        where: where
    }).then(function(todos){
        return res.status(200).json(todos).send();
    }).catch(function(e){
        return res.status(500).json(e).send();
    });
});

//todos/:id
app.get('/todos/:id', function(req, res){
    var todoID = parseInt(req.params.id, 10);

    db.todo.findById(req.params.id).then(function(todo){
        if(!!todo){
            return res.status(200).json(todo.toJSON()).send();
        }else{
            return res.status(404).send();
        }

    }).catch(function(e){
        return res.status(500).json(e).send();
    });
});

// post /todos
app.post('/todos', function(req, res){
    var body = _.pick(req.body, 'description', 'completed');

    db.todo.create(body)
        .then(function(todo){
            return res.status(200).json(todo.toJSON()).send();
        }).catch(function(e){
            return res.status(400).json(e).send();
        });

});

app.delete('/todos/:id', function(req,res){
    var todoID = parseInt(req.params.id, 10);

    db.todo.destroy({ where: {
        id: req.params.id
    }}).then(function(rowsDeleted){
        if(rowsDeleted === 0){
            return res.status(404).json({
                error: "No todo with id " + todoID
            }).send();
        }else{
            return res.status(204).send();
        }
    }).catch(function(e){
        return res.status(500).send();
    });
});

app.put('/todos/:id', function(req,res){
    var body = _.pick(req.body, 'description', 'completed');
    var attributes = {};

    if(body.hasOwnProperty('completed')){
        attributes.completed = body.completed;
    }
    if(body.hasOwnProperty('description')){
        attributes.description = body.description;
    }

    db.todo.findById(req.params.id).then(function(todo){
        if(todo){
            return todo.update(attributes);
        }else{
            res.status(404).send();
        }
    }, function(){
        res.status(500).send();
    }).then(function(todo){
        res.json(todo.toJSON());
    }, function(e){
        res.status(400).json(e).send();
    });
});

db.sequelize.sync().then(function(){
    app.listen(PORT, function(){
        console.log("Listening on port " + PORT + "...");
    });
});
