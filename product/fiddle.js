const request = require('request-promise');
const cheerio = require('cheerio');

const check_article_for_image = () => {

	const options = {
		method: 'GET',
		uri: 'https://blog.risingstack.com/history-of-node-js/',
		transform: body => cheerio.load(body),
	}

	request(options)
		.then($ => {
			$(".post-content img")
				.not(".post-author, .share-icon-container img, iframe")
				.each((i, el) => {
					console.log($(el).attr("alt"))
				})
		})
		.catch(err => {
			console.log('request error: ', err);
		})
}

check_article_for_image()