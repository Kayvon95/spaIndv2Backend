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

//find by id
routes.get('/:id', function (req, res) {
    Comment.findOne({'_id': req.params.id})
        .then((comment) => {
            res.status(200).json(comment);
        })
        .catch((error) => {
            res.status(400).json(error);
        })
});

//edit comment
routes.put('/:id', function (req, res) {
    const commentProps = req.body;
    const updatedComment = {
        'user': commentProps._user,
        'content': commentProps._content
    };
    Comment.findByIdAndUpdate({'_id': req.params.id}, updatedComment)
        .then(() => {
            Comment.findOne({'_id': req.params._id})
                .then((char) => {
                    res.status(200).json({message: 'Comment updated'});
                })
        })
});

//Delete Comment
routes.delete('/:id', function (req, res) {
    Comment.findOne({'_id': req.params.id})
        .then((comment) => {
            comment.remove()
                .then(() => {
                    res.status(200).json({message: 'Comment removed'});
                })
        })
});

module.exports = routes;

