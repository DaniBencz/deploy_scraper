'use strict'

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;
require('dotenv').config();
const getAllArticles = require('./product/scraper');
const typeChecker = require('./middleware/typeChecker');

app.use(express.static(path.join(__dirname, 'user')));
app.use(express.json());
app.use('/articles', typeChecker);

app.post('/articles', (req, res) => {
	const pages = req.body.pages;
	getAllArticles(1, pages)
		.then(articles => {
			res.json({ articles });
		})
		.catch(() => res.status(500).send('Something went wrong, please try again later!'))
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
