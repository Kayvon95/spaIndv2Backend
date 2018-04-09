const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/messageboard_test');
mongoose.connection
    .once('open', () => console.log('Connected to messageboard_test database.'))
    .on('error', (error) => {
        console.warn('Warning', error)
    });

beforeEach ((done) => {
    mongoose.connection.collections.users.drop(() => {
        // Ready for next test
        done();
    });
});