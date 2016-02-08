var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-sqlite-db.sqlite'
});

var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1,250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

sequelize.sync().then(function(){
    console.log("Everything is synced");

    // fetch todo by id
    var id = 26;
    Todo.findById(id).then(function(todo){
        if(todo){
            console.log(todo.toJSON());
        }else{
            console.log("Todo with id " + id + " not found");
        }
    });


    // Todo.create({
    //     description: "Take out trash"
    // }).then(function(todo){
    //     console.log("Finished!");
    //     console.log("Todo");
    //     return Todo.create({
    //         description: "Clean office"
    //     });
    // }).then(function(){
    //     //return Todo.findById(1);
    //     return Todo.findAll({
    //         where: {
    //             description: {
    //                 $like: "%OffiCe%"
    //             }
    //         }
    //     });
    // }).then(function(todos){
    //     if(todos){
    //         todos.forEach(function(todo){
    //             console.log(todo.toJSON());
    //         });
    //     }else{
    //         console.log("No todo found");
    //     }
    // }).catch(function(e){
    //     console.log(e);
    // });
});
