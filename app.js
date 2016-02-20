var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var bcrypt = require('bcrypt');

var db = require('./db.js');
var middleware = require('./middleware.js')(db);

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
app.get('/todos', middleware.requireAuthentication, function(req, res){
    var query = req.query;
    var where = {
        userId: req.user.get('id')
    };

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
app.get('/todos/:id', middleware.requireAuthentication, function(req, res){
    var todoID = parseInt(req.params.id, 10);
    var where = {
        id: req.params.id,
        userId: req.user.get('id')
    }

    db.todo.findOne({
        where: where
    }).then(function(todo){
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
app.post('/todos', middleware.requireAuthentication, function(req, res){
    var body = _.pick(req.body, 'description', 'completed');

    body.userId = req.user.get('id');

    db.todo.create(body)
        .then(function(todo){
            return res.status(200).json(todo.toJSON()).send();
        }).catch(function(e){
            return res.status(400).json(e).send();
        });

});

app.delete('/todos/:id', middleware.requireAuthentication, function(req,res){
    var todoID = parseInt(req.params.id, 10);
    var where = {
        id: req.params.id,
        userId: req.user.get('id')
    }

    db.todo.destroy({
        where: where
    }).then(function(rowsDeleted){
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

app.put('/todos/:id', middleware.requireAuthentication, function(req,res){
    var body = _.pick(req.body, 'description', 'completed');
    var attributes = {};

    if(body.hasOwnProperty('completed')){
        attributes.completed = body.completed;
    }
    if(body.hasOwnProperty('description')){
        attributes.description = body.description;
    }

    var where = {
        id: req.params.id,
        userId: req.user.get('id')
    }

    db.todo.findOne({
        where: where
    }).then(function(todo){
        if(todo){
            todo.update(attributes).then(function(todo){
                res.json(todo.toJSON());
            }, function(e){
                res.status(400).json(e).send();
            });
        }else{
            res.status(404).send();
        }
    }, function(){
        res.status(500).send();
    });
});

app.post('/user', function(req,res){
    var body = _.pick(req.body, 'email', 'password');

    db.user.create(body)
        .then(function(user){
            return res.status(200).json(user.toPublicJSON()).send();
        }).catch(function(e){
            return res.status(400).json(e).send();
        });
});

app.post('/user/login', function(req, res){
    var body = _.pick(req.body, 'email', 'password');

    db.user.authenticate(body).then(function(user){
        var token = user.generateToken('authentication');
        if(token){
            res.header('Auth', token).json(user.toPublicJSON()).send();
        }else{
            res.status(401).send();
        }
    }, function(){
        res.status(401).send();
    });
});

db.sequelize.sync().then(function(){
    app.listen(PORT, function(){
        console.log("Listening on port " + PORT + "...");
    });
});
