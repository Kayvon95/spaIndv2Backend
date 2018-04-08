const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }],
    created_at: { type: Date, default: Date.now },
    user: {type: Schema.Types.ObjectId, ref: 'user' }
});

const Post = mongoose.model('post', PostSchema);
module.exports = Post;