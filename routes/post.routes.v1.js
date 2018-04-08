/**
 * Created by Kayvon Rahimi on 7-4-2018.
 */
var express = require('express');
var routes = express.Router();
var Post = require('../model/post');
var Comment = require('../model/comment');


routes.get('/', function (req, res) {
    Post.find({})
        .populate('comments')
        .then((post) => {
            res.status(200).json(post);
        })
        .catch((error) => {
            res.status(400).json(error);
        })
});

//find post by Id
routes.get('/:id', function (req, res) {
    Post.findOne({'_id': req.params.id})
        .populate('comments')
        .then((post) => {
            res.status(200).json(post);
        })
        .catch((error) => {
            res.status(400).json(error);
        })
});

//Post comment on PostID
routes.put('/:id/comment', function (req, res) {
    const commentProps = req.body;
    const comment = new Comment({
        'user': commentProps._user,
        'content': commentProps._content
    });
    Post.findOne({'_id': req.params.id})
        .then((post) => {
            post.comments.push(comment);
            Promise.all([comment.save(), post.save()])
                .then(() => {
                    res.send(post);
                })
        })
});
//Remove post by postID and commentID
routes.delete('/:id/comment/:commentId', function (req, res) {
    console.log(req.params);
    Post.findOne({'_id': req.params.id})
        .then((post) => {
            var commentIndex = post.comments.indexOf(req.params.commentId);
            console.log(commentIndex);
            post.comments.splice(commentIndex, 1);
            post.save()
                .then(() => {
                    Comment.findByIdAndRemove({'_id': req.params.commentId})
                        .then(() => {
                            res.send(Post);
                        })
                })
        });
});

module.exports = routes;

