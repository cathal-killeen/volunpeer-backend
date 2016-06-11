var express = require('express');
var _ = require('underscore');
var db = require('../db');
var router = express.Router();

var orgs = [
    {
        id: 1,
        name: "Concern"
    },
    {
        id: 2,
        name: "CoderDojo"
    },
    {
        id: 3,
        name: "Trocaire"
    }
];

router.get('/', function(req, res){
    res.status(200).json(orgs).send();
})

router.get('/:id', function(req, res){
    var orgID = parseInt(req.params.id, 10);
    res.status(200).json(orgs[orgID-1]).send();
})


module.exports = router;
