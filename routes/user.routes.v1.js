/**
 * Created by Kayvon Rahimi on 7-4-2018.
 */
var express = require('express');
var routes = express.Router();
const User = require('../model/user');
const Post = require('../model/post');
const Comment = require('../model/comment');

//Find All
routes.get('/', function (req, res) {
    User.find({})
        .populate({
            path: 'posts',
            populate: {
                path: 'comments',
                model: 'comment'
            }
        })
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((error) => {
            res.status(400).json(error);
        })
});

//Find One
routes.get('/:id', function (req, res) {
    User.findOne({'_id': req.params.id})
        .populate({
            path: 'posts',
            populate: {
                path: 'comments',
                model: 'comment'
            }
        })
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((error) => {
            res.status(400).json(error);
        })
});

//Find one based on UserId
routes.get('/:id/posts', function (req, res) {
    User.findOne({'_id': req.params.id})
        .sort([['created_at', 'descending']])
        .populate({
            path: 'posts',
            ref: 'post'
        })
        .then((user) => {
            res.status(200).json(user.posts);
        })
        .catch((error) => {
            res.status(400).json(error);
        })
});
//Create
routes.post('/', function (req, res) {
    console.log(req.body);
    const newUser = new User({
        'userName': req.body.userName,
        'firstName': req.body.firstName,
        'lastName': req.body.lastName,
        'email': req.body.email
    });
    User.create(newUser)
        .then(user => {
            console.log("create: " + user);
            user.save();
            res.send(user)
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});
//Update user
routes.put('/:id', function (req, res) {
    const userProps = req.body;
    console.log(req.body);
    const updatedUser = {
        'userName': req.body.userName,
        'firstName': req.body.firstName,
        'lastName': req.body.lastName,
        'email': req.body.email
    };
    //console.log(updatedUser);
    User.findByIdAndUpdate({'_id': req.params.id}, updatedUser)
        .then(() => {
            User.findOne({_id: req.params.id})
                .then((user) => {
                    res.send(user);
                })
        })
});

//Delete user
routes.delete('/:id', function (req, res) {
    User.findOne({'_id': req.params.id})
        .then((user) => {
            user.remove()
                .then(() => {
                    res.status(200).json({message:'User removed'});
                })
        })
});

//Add Post by User
routes.put('/:id/post', function (req, res) {
    const postProps = req.body;
    const post = new Post({
        'title': postProps.title,
        'content': postProps.content,
        'tag': postProps.tag,
        'comments': postProps.comments
    });
    User.findOne({'_id': req.params.id})
        .then((user) => {
            user.posts.push(post);
            Promise.all([post.save(), user.save()])
                .then(() => {
                    res.send(user);
                })
        })
});

//Remove Post(by id) from User(by id)
routes.delete('/:id/post/:postId', function (req, res) {
    console.log(req.params);
    User.findOne({'_id': req.params.id})
        .then((user) => {
            var postIndex = user.posts.indexOf(req.params.postId);
            console.log(postIndex);
            user.posts.splice(postIndex, 1);
            user.save()
                .then(() => {
                    Post.findByIdAndRemove({'_id': req.params.postId})
                        .then(() => {
                            res.send(user);
                        })
                })
        });
});



module.exports = routes;