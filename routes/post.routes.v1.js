/**
 * Created by Kayvon Rahimi on 7-4-2018.
 */
var express = require('express');
var routes = express.Router();
var Post = require('../model/post');
var Comment = require('../model/comment');

//Find all posts
routes.get('/', function (req, res) {
    Post.find({})
        .sort([['created_at', 'descending']])
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

//Post a post
routes.post('/', function (req, res) {
    console.log(req.body);
    const newPost = new Post({
        'title': req.body.title,
        'content': req.body.content,
        'tag': req.body.tag,
    });
    Post.create(newPost)
        .then(post => {
            console.log("create: " + post);
            post.save();
            res.send(post)
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

//Update Post
routes.put('/:id', function (req, res) {
    const postProps = req.body;
    const updatedPost = {
        'title': postProps.title,
        'content': postProps.content,
        'tag': postProps.tag,
        'comments': postProps.comments
    };
    Post.findByIdAndUpdate({'_id': req.params.id}, updatedPost)
        .then(() => {
            Post.findOne({'_id': req.params.id})
                .then((result) => {
                    res.send(result);
                })
        })
        .catch(error => {
            res.send(error);
            console.log(error);
        })
});

//Remove post
routes.delete('/:id', function (req, res) {
    Post.findOne({'_id': req.params.id})
        .then((post) => {
            post.remove()
                .then(() => {
                    res.status(200).json({message:'Post removed'});
                })
        })
});

//Post comment on PostID
routes.put('/:id/comment', function (req, res) {
    const commentProps = req.body;
    const comment = new Comment({
        'user': commentProps.user,
        'content': commentProps.content
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
//Remove comment by postID and commentID
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

