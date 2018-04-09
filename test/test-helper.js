const mongoose = require('mongoose');

before(done => {
    mongoose.connect('mongodb://localhost/messageboard_test');
    mongoose.connection
        .once('open', () => done())
        .on('error', error => {
            console.warn('Warning', error);
        });
});

// beforeEach((done) => {
//     const { users, comments, posts } = mongoose.connection.collections;
//     users.drop(() => {
//         comments.drop(() => {
//             posts.drop(() => {
//                 done();
//             });
//         });
//     });
// });