const Blog = require("../models/Blog");
const User = require("../models/User");


async function getAll() {
    return Blog.find({}).lean();
}

async function createBlog(blog) {
    return Blog.create(blog);
}

async function getById(id) {
    return Blog.findById(id).lean();
}

async function getWithOwner(id) {
    return Blog.findById(id).populate('owner').lean();
}

async function deleteById(id) {
    return Blog.findByIdAndDelete(id);
}

async function updateById(id, data) {
    const existing = await Blog.findById(id);

    existing.title = data.title;
    existing.imageUrl = data.imageUrl;
    existing.description = data.description;
    existing.category = data.category;

    return existing.save();
}
async function blogCreatedByUser(blogId, userId) {
    const currentUser = await User.findById(userId);

    currentUser.blogsCreated.push(blogId);

    return currentUser.save();
}

async function followBlogByUser(blogId, userId) {
    const existing = await Blog.findById(blogId);
    const currentUser = await User.findById(userId);

    existing.followersList.push(currentUser.username);
    currentUser.blogsFollowed.push(existing.title);

    return existing.save() && currentUser.save();
}
 
module.exports = {
    getAll, 
    createBlog,
    getById,
    deleteById, 
    updateById,
    blogCreatedByUser,
    followBlogByUser,
    getWithOwner
};