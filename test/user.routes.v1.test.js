process.env.NODE_ENV = 'test';
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();
const mongoose = require('mongoose');
var User = require('../model/user');

//User om mee te testen
const user = new User({
    userName: 'Testusername',
    firstName: 'Ben',
    lastName: 'Morrow',
    email: 'ben@testmail.com'});

//Declare chai usage for assertion
chai.use(chaiHttp);

describe('Creating a user', () => {
    before((next) => {
        user.save()
            .then(() => {
                next();
            })
    })

    describe('/GET users', () => {
        it('it should return all users', (done) => {
            chai.request(server)
                .get('/api/v1/users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body[0].should.have.property('userName').equal('user01');
                    res.body[0].should.have.property('firstName').equal('Abel');
                    done();
                });
        });
        it('it should find a specified user by id', (done) => {
            chai.request(server)
                .get('/api/v1/users/' + user._id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('userName').equal('Testusername');
                    res.body.should.have.property('firstName').equal('Ben');
                    res.body.should.have.property('lastName').equal('Morrow');
                    done();
                });
        });

    });
    describe('/POST users', () => {
        it('it should post a new user and return it', (done) => {
            var newUser= {
                userName: 'NewTestUser',
                firstName: 'Newtest',
                lastName: 'Testnew',
                email: 'test@testmail.com'
            };
            console.log(newUser);
            chai.request(server)
                .post('/api/v1/users')
                .send(newUser)
                .end((err, res) => {
                    // console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('userName').equal('NewTestUser');
                    res.body.should.have.property('firstName').equal('Newtest');
                    res.body.should.have.property('lastName').equal('Testnew');
                    res.body.should.have.property('email').equal('test@testmail.com');
                    done();
                });
        });
    });

    describe('/PUT user', () => {
        it('it should edit a fetched user and return it', (done) => {
            chai.request(server)
                .get('/api/v1/users')
                .end((err, res) => {
                    chai.request(server)
                        .put('/api/v1/users/' + res.body[0]._id)
                        .send({
                            userName: 'EditedUsername',
                            firstName: 'EditedFirstname',
                            lastName: 'EditedLastname',
                            email:'edited@testmail.com'})
                        .end((err, response) => {
                            console.log(res.body);
                            response.should.have.status(200);
                            response.body.should.be.a('object');
                            res.body.should.have.property('userName').equal('EditUserame');
                            res.body.should.have.property('firstName').equal('EditedFirstname');
                            res.body.should.have.property('lastName').equal('EditedLastname');
                            res.body.should.have.property('email').equal('edited@testmail.com');
                            done();
                        });
                })
        });

        it('it should add a post to a user and return it', (done) => {
            chai.request(server)
                .put('/api/v1/users/' + game._id + '/post')
                .send({
                    title: 'Testpost',
                    content: 'Testcontent'
                })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('posts').should.be.a('object');
                    done();
                });
        })
    });
    describe('/DELETE user', () => {
        it('it should delete a user by ud', (done) => {
            chai.request(server)
                .get('/api/v1/users')
                .end((err, res) => {
                    // console.log(res.body);
                    chai.request(server)
                        .delete('/api/v1/users/' + user._id)
                        .end((err, response) => {
                            response.should.have.status(200);
                            response.body.should.be.a('object');
                            response.body.should.have.property('message').equal('game removed');
                            done();
                        });
                })
        });
    });

    //clear collection
    // after((done => {
    //     const { games } = mongoose.connection.collections;
    //     games.drop(() => {
    //         done();
    //     });
    // }))

});