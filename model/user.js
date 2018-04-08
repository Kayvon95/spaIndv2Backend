const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true
    },
    // created_at: { type: Date, default: Date.now },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'post'
    }]
});

const User = mongoose.model('user', UserSchema);
module.exports = User;