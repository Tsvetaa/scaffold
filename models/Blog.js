const { Schema, model, Types } = require('mongoose');

const URL_PATTERN = /https?:\/\/./i;

const blogSchema = new Schema({
    title: {
        type: String,
        minlength: [5, 'The Title should be at least 5 characters'],
        maxlength: [50, 'The Title should be no longer than 50 characters']
    },
    imageUrl: {
        type: String,
        validate: {
            validator: (value) => URL_PATTERN.test(value),
            message: 'Invalid URL'
        }
    },
    content: {
        type: String,
        minlength: [10, 'The Content should be a minimum of 10 characters long']
    },
    category: {
        type: String,
        minlength: [3, 'The Category should be a minimum of 3 characters long'],
    },
    followersList: { type: [String] },
    owner: { type: Types.ObjectId, ref: 'User' }
});

blogSchema.index({ title: 1 }, {
    collation: {
        localae: 'en',
        strength: 2
    }
});

const Blog = model('Blog', blogSchema);

module.exports = Blog;