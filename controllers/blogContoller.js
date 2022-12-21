const { createBlog, getById, deleteById, updateById, blogCreatedByUser, followBlogByUser, getWithOwner } = require('../services/blogService');
const { parseError } = require('../util/parser');
const { hasUser } = require('../middlewares/guards')

const blogController = require('express').Router();

blogController.get('/create', hasUser(), (req, res) => {
    res.render('create', {
        title: 'Create Blog'
    });
});

blogController.post('/create', hasUser(), async (req, res) => {
    const blog = {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        content: req.body.content,
        category: req.body.category,
        owner: req.user._id
    };

    try {
        await createBlog(blog);

        res.redirect('/');
    } catch (error) {
        res.render('create', {
            title: 'Create Blog',
            errors: parseError(error),
            body: blog
        });
    }

    await blogCreatedByUser(req.blog._id, req.user._id);

})

blogController.get('/:id/delete', async (req, res) => {
    const blog = await getById(req.params.id);

    if (blog.owner.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login');
    }
    await deleteById(req.params.id);
    res.redirect('/');
})

blogController.get('/:id/edit', async (req, res) => {
    const blog = await getById(req.params.id);

    if (blog.owner.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login');
    }

    res.render('edit', {
        title: 'Edit Blog',
        blog
    });
});

blogController.post('/:id/edit', async (req, res) => {
    const blog = await getById(req.params.id);

    if (blog.owner.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login');
    }

    try {
        await updateById(req.params.id, req.body);
        res.redirect(`/blog/${req.params.id}`);
    } catch (error) {
        res.render('edit', {
            title: 'Edit Course',
            errors: parseError(error),
            course: req.body
        });
    }

});

blogController.get('/:id/follow', async (req, res) => {
    const blog = await getById(req.params.id);

    if (blog.owner.toString() != req.user._id.toString()
        && blog.followersList.map(x => x.toString()).includes(req.user._id.toString()) == false) {
        await followBlogByUser(req.params.id, req.user._id);
    } else {
        blog.isFollowed = true;
    }

    return res.redirect(`/blog/${req.params.id}`);
})

blogController.get('/:id', async (req, res) => {
    const blog = await getById(req.params.id);

    blog.isUser = typeof req.user !== 'undefined'
    blog.isOwner = blog.owner.toString() == req.user._id.toString()
    blog.isFollowed = blog.followersList.map(x => x.toString()).includes(req.user._id.toString())
    
    const blogDetails = await getWithOwner(req.params.id)
    console.log(blog.isUser);
    console.log(blog.isOwner);
    console.log(blog.isFollowed);


    res.render('details', {
        title: blog.title,
        blog,
        blogDetails
    });
});

module.exports = blogController; 