const express = require('express');
const { join } = require('path');
const server = require('./qr');
const code = require('./pair');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/qr', server);
app.use('/code', code);

app.get('/pair', (req, res) => {
    res.sendFile(join(__dirname, '../public/pair.html'));
});

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../public/index.html'));
});

module.exports = app;
