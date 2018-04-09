/**
 * Created by Kayvon Rahimi on 9-4-2018.
 */
process.env.NODE_ENV = 'test';
var chai = require('chai');
const assert = require('assert');
const mongoose = require('mongoose');
var Post = require('../model/post');
const server = require('../server');
const request = require('supertest');

//Post om mee te testen
const post = new Post({
    title: 'Testpost!',
    tag: 'Test',
    content: 'A post to test with.'
    });

describe('Posts processing', () => {
    it('add new Post then GET /api/v1/posts/:id ', done => {
        const post = new Post({ title: 'My title' });

        post.save().then(() => {
            request(server)
                .get(`/api/v1/posts/${post._id}`)
                .end(() => {
                    Post.count().then(count => {
                        assert(count === 1);
                        done();
                    });
                });
        });
    });

    it('POST to /api/v1/posts requires a title', (done) => {
        request(server)
            .post('/api/v1/posts')
            .send({})
            .end((err, res) => {
                assert(res.body.error);
                done();
            });
    });

    it('Put to /api/v1/posts/id can update a record', done => {
        const post = new Post({
            title: 'Testtitle',
            content: "Testcontent"
        });

        post.save().then(() => {
            request(server)
                .put(`/api/v1/posts/${post._id}`)
                .send({ content: "Testcontent" })
                .end(() => {
                    Post.findOne({ title: 'Testtitle' })
                        .then(post => {
                            assert(post.content === "Testcontent");
                            done();
                        });
                });
        });
    });

    it('Delete a record with /api/v1/posts/:id ', done => {
        const post = new Post({ title: 'Testtitle' });

        post.save().then(() => {
            request(server)
                .delete(`/api/v1/posts/${post._id}`)
                .end(() => {
                    Post.count().then(count => {
                        assert(count === 0);
                        done();
                    });
                });
        });
    });
});