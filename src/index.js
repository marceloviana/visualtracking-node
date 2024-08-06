const fs = require('fs');
const express = require('express')
const app = express()
const port = 80

app.use(function(req, res, next) {
	res.setHeader('version', fs.readFileSync('./src/version.txt', 'utf-8'));
	next();
	}
)

app.get('/', (req, res) => res.send('<h1>Hello World!</h1>'))
app.get('/health', (req, res) => res.send('<h1>I\'m fine!</h1>'))
app.get('/changelog', (req, res) => res.sendFile('changelog.html', {root: __dirname}))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))