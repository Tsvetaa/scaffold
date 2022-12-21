const { Schema, model, Types } = require('mongoose');


//TODO add User properties and validation according to assigment check length username
const userSchema = new Schema({
    username: { type: String, required: true, unique: true, minlength: [2, "Username must be at least 2 characters long!"] },
    email: { type: String, required: true, unique: true, minlength: [10, "Email must be at least 10 characters long!"] },
    hashedPassword: { type: String, required: true },
    blogsCreated: {  type: [Types.ObjectId], ref: 'Blog', default: []  },
    blogsFollowed: { type: [String] }
});

userSchema.index({ username: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const User = model('User', userSchema);

module.exports = User;