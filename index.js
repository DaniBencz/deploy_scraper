'use strict'

const express = require('express')
const helmet = require("helmet")
const path = require('path')
const app = express()
const PORT = process.env.PORT || 4000
require('dotenv').config()
const getAllArticles = require('./product/scraper')
const typeChecker = require('./middleware/typeChecker')

app.use(helmet())
app.use(express.static(path.join(__dirname, 'user')))
app.use(express.json())
app.use('/articles', typeChecker)

app.post('/articles', (req, res) => {
  getAllArticles(0, req.body.pages)
    .then(articles => {
      res.json({ articles })
    })
    .catch(() => res.status(500).send('Something went wrong, please try again later!'))
})

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
