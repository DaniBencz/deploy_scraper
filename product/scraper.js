'use strict'

const request = require('request-promise')
const cheerio = require('cheerio')
const mysql = require('mysql')

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  multipleStatements: true
})

const saveArticlesInDB = (pageNum, articlesWithoutImage) => {
  const articlesString = articlesWithoutImage.join(',')
  conn.query(`DELETE FROM articles_by_page WHERE page=${pageNum};`)
  conn.query(`INSERT INTO articles_by_page (page,urls) VALUES(${pageNum},'${articlesString}');`, (err, row) => {
    if (err) console.error('error inserting into DB: ', err)
    else console.log('successful insertion')
  })
}

const scrapeArticlesByPage = (pageNum, articles, useDB) => {
  return new Promise((resolve) => {
    const articlesWithoutImage = []
    let articleIndex = 0

    const scarpeSingleArticle = () => {
      if (articleIndex < articles.length) {
        const options = {
          method: 'GET',
          uri: 'https://blog.risingstack.com' + articles[articleIndex],
          transform: body => cheerio.load(body)
        }

        request(options)
          .then($ => {
            process.stdout.write('.')
            if ($('.post-content img')
              .not('.post-author img, .share-icon-container img, iframe')
              .length === 0) articlesWithoutImage.push(options.uri)
            articleIndex++
            scarpeSingleArticle()
          })
          .catch(err => {
            console.log('request error: ', err)
            articleIndex++
            scarpeSingleArticle()
          })
      } else {
        console.log('done scraping')
        if (useDB) saveArticlesInDB(pageNum, articlesWithoutImage)
        resolve(articlesWithoutImage)
      }
    }
    scarpeSingleArticle()
  })
}

const filterArticlesByPage = (pageNum, useDB) => {
  return new Promise((resolve, reject) => {
    const path = pageNum > 1 ? '/page/' + pageNum : ''
    const options = {
      method: 'GET',
      uri: `https://blog.risingstack.com${path}`,
      transform: body => cheerio.load(body)
    }

    request(options)
      .then(($) => {
        const articles = []
        $('.main-inner article .post-title a').each((i, el) => {
          articles.push($(el).attr('href'))
        })
        console.log(`serving page ${pageNum} from web`)
        resolve(scrapeArticlesByPage(pageNum, articles, useDB))
      })
      .catch(err => {
        console.log('request error: ', err)
        reject(err)
      })
  })
}

const getArticlesByPage = (pageNum, useDB) => {
  return new Promise((resolve, reject) => {
    if (useDB) {
      conn.query('SELECT page FROM articles_by_page LIMIT 1;', (err, rows) => {
        if (err) {
          console.error('error reading from DB: ', err)
          resolve(filterArticlesByPage(pageNum, useDB))
        } else {
          conn.query(`SELECT urls FROM articles_by_page WHERE page=${pageNum};`, (err, urls) => {
            if (err) {
              console.error('error reading from DB: ', err)
              resolve(filterArticlesByPage(pageNum, useDB))
            } else if (urls.length === 0) resolve(filterArticlesByPage(pageNum, useDB))
            else {
              const urlsArray = urls[0].urls.split(',')
              console.log(`serving page ${pageNum} from DB`)
              resolve(urlsArray)
            }
          })
        }
      })
    } else resolve(filterArticlesByPage(pageNum, useDB))
  })
}

const getAllArticles = (useDB = false, pages = 1) => {
  return new Promise((resolve, reject) => {
    const articlesPerPagePromises = []
    for (let i = 1; i <= pages; i++) {
      articlesPerPagePromises.push(getArticlesByPage(i, useDB))
    }
    Promise.all(articlesPerPagePromises)
      .then((articlesPerPage) => {
        const allArticles = articlesPerPage.reduce((acc, cur) => {
          return acc.concat(cur)
        })
        resolve(allArticles)
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
  })
}

module.exports = getAllArticles
