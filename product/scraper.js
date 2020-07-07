'use strict'

const request = require('request-promise');
const cheerio = require('cheerio');
const mysql = require('mysql');

const conn = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	multipleStatements: true
});

const saveArticlesInDB = (page_num, articles_without_image) => {
	let articles_string = articles_without_image.join(',');
	conn.query(`DELETE FROM articles_by_page WHERE page=${page_num};`);
	conn.query(`INSERT INTO articles_by_page (page,urls) VALUES(${page_num},'${articles_string}');`, (err, row) => {
		if (err) console.error('error inserting into DB: ', err);
		else console.log('successful insertion');
	});
}

const scrapeArticlesByPage = (page_num, articles, useDB) => {
	return new Promise((resolve, reject) => {
		let articles_without_image = [];
		let article_index = 0;

		const scarpeSingleArticle = () => {
			if (article_index < articles.length) {
				const options = {
					method: 'GET',
					uri: 'https://blog.risingstack.com' + articles[article_index],
					transform: body => cheerio.load(body),
				}

				request(options)
					.then($ => {
						process.stdout.write(`.`);
						if ($(".post-content img")
							.not(".post-author img, .share-icon-container img, iframe")
							.length === 0) articles_without_image.push(options.uri);
						article_index++;
						scarpeSingleArticle();
					})
					.catch(err => {
						console.log('request error: ', err);
					});
			}
			else {
				console.log('done scraping');
				if (useDB) saveArticlesInDB(page_num, articles_without_image);
				resolve(articles_without_image);
			}
		}
		scarpeSingleArticle();
	});
}

const filterArticlesByPage = (page_num, useDB) => {
	return new Promise((resolve, reject) => {
		const path = page_num > 1 ? '/page/' + page_num : '';
		const options = {
			method: 'GET',
			uri: `https://blog.risingstack.com${path}`,
			transform: body => cheerio.load(body),
		}

		request(options)
			.then(($) => {
				let articles = [];
				$(".main-inner article .post-title a").each((i, el) => {
					articles.push($(el).attr("href"));
				});
				console.log(`serving page ${page_num} from web`);
				resolve(scrapeArticlesByPage(page_num, articles, useDB));
			})
			.catch(err => {
				console.log('request error: ', err);
				reject('request error');
			});
	})
}

const getArticlesByPage = (page_num, useDB) => {
	return new Promise((resolve, reject) => {

		if (useDB) {
			conn.query('SELECT page FROM articles_by_page LIMIT 1;', (err, rows) => {
				if (err) {
					console.error('error reading from DB: ', err);
					resolve(filterArticlesByPage(page_num, useDB));
				}
				else {
					conn.query(`SELECT urls FROM articles_by_page WHERE page=${page_num};`, (err, urls) => {
						if (err) {
							console.error('error reading from DB: ', err);
							resolve(filterArticlesByPage(page_num, useDB));
						}
						else if (urls.length === 0) resolve(filterArticlesByPage(page_num, useDB));
						else {
							let urls_array = urls[0].urls.split(',');
							console.log(`serving page ${page_num} from DB`);
							resolve(urls_array);
						}
					})
				}
			});
		}
		else resolve(filterArticlesByPage(page_num, useDB));
	});
}

const getAllArticles = (useDB = false, pages = 1) => {
	return new Promise((resolve, reject) => {
		let articles_per_page_promises = [];
		for (let i = 1; i <= pages; i++) {
			articles_per_page_promises.push(getArticlesByPage(i, useDB));
		}
		Promise.all(articles_per_page_promises)
			.then((articles_per_page) => {
				let all_articles = articles_per_page.reduce((acc, cur) => {
					return acc.concat(cur);
				});
				resolve(all_articles);
			})
			.catch(err => console.log(err))
	})
}

module.exports = getAllArticles;
