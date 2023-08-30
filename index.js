const express = require('express');
const axios = require('axios');
const path = require('node:path');
const fs = require('node:fs');

const { getIDVideo, getOriginalUrl, generateToken, serializeResult } = require(path.join(__dirname, '.', 'library', 'functions'));

const apps = express();
const PORT = process.env.PORT || '8080';
const tokens = generateToken();

apps.use(express.static('image'));
apps.use(express.static('css'));
apps.use(express.static('js'));
apps.use(express.urlencoded({ extended: true }));
apps.use(express.json());

apps.set('views', 'client');
apps.set('view engine', 'pug');

apps.get('/', (req, res) => {
  res.render('index', {
    token: tokens
  });
})
apps.post('/api/download.rokumo', async (req, res) => {
  try {
    const { url, token } = req.body;
    if (token !== tokens) return res.json({ status: false, type: 'token', message: 'error token, please reload browser.' });
    const link = await getOriginalUrl(url);
    const getID = getIDVideo(link);
    const { data } = await axios.get(`https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${getID}`);
    const result = serializeResult(data);
    res.json({ status: true, type: 'data', data: result });
  } catch (error) {
    res.json({
      status: false,
      type: 'error',
      message: error.message
    });
  }
});

apps.listen(PORT, () => console.log('success connected in port:', PORT));
