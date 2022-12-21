const { getAll } = require('../services/blogService');

const homeController = require('express').Router();

//TODO replace with real controller by assigment
homeController.get('/', async (req, res) => {
    let blogs = await getAll();

    res.render('home', {
        title: 'Home Page',
        user: req.user,
        blogs
    });
});

homeController.get('/catalog', async (req, res) => {
    let blogs = await getAll();

    res.render('catalog', {
        title: 'Catalog Page',
        user: req.user,
        blogs
    });
});



module.exports = homeController;