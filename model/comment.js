/**
 * Created by heavenduke on 16-5-8.
 */

var Comment = {};

Comment.Schema = {
    content: {
        type: String,
        required: false
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    journal_id: {
        type: require('mongoose').Schema.ObjectId,
        ref: "Journals"
    }
};

Comment.collection = {
    collection: 'Comments'
};

module.exports = Comment;