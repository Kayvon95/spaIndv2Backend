/**
 * Created by Kayvon Rahimi on 7-4-2018.
 */
/**
 * Created by Kayvon Rahimi on 7-4-2018.
 */
var express = require('express');
var routes = express.Router();
// var Post = require('../model/post');
var Comment = require('../model/comment');

routes.get('/', function (req, res) {
    Comment.find({})
        .then((comment) => {
            res.status(200).json(comment);
        })
        .catch((error) => {
            res.status(400).json(error);
        })
});

module.exports = routes;

