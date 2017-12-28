const axios = require('axios');
const express = require('express');

const app = express();
const server = require('http').Server(app);

const apiMangaUrl = 'http://localhost:2812';
const port = 2812;

server.listen(port, () => {
	console.log(`Mia Mangas API started on port ${port}`):
});

app.get('highscores', (req, res) => {

	const minScore = req.query.min || 7;

	axios.get(`${apiMangaUrl}/mangas/all`)
	.then(response => {

		const favouritesMangas = response.data
		.filter(i => i.score > minScore)
		.reduce((memo, item) => {
			memo.push(item._source.manga.name);
			return memo;
		}, []);

		res.send({
			status: 'success',
			data: favouritesMangas
		})
	});
});

app.get('favourites', (req, res) => {

	const total = req.query.total || 5;

	axios.get(`${apiMangaUrl}/mangas/all`)
	.then(response => {

		const lightMangas = response.data
		.map(item => {
			return {
				name: item._source.manga.name,
				score: item._score
			};
		})
		.sort((a, b) => {
			if(a.score > b.score) {
				return 1
			} else if(a.score < b.score) {
				return -1;
			}

			return 0;
		})
		.reverse()
		.slice(0, total)
		.map(manga => manga.name);

		res.send({
			status: 'success',
			data: lightMangas
		})
	});
});
