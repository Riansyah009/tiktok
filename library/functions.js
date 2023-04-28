const https = require('node:https');
const crypto = require('node:crypto');

module.exports = {
  generateToken: () => crypto.randomBytes(15).toString('hex'),
  regexUrl: (url) => {
    const regex = /^https?:\/\/([a-z]+\.|)tiktok\.com\/([\w]+|\@\D+\w+)/g;
    return url.match(regex);
  },
  getIDVideo: (link) => {
    if (!module.exports.regexUrl(link)) throw 'invalid tiktok url';
    return link.match(/video\/([\d|\+]+)?\/?/)[1];
  },
  getOriginalUrl: (link) => {
    return new Promise((resolve, reject) => {
      const url = new URL(link);
      const options = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'GET',
      };
      const request = https.request(options, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) return resolve(res.headers.location);
        resolve(link);
      });
      request.on('error',
        reject);
      request.end();
    });
  },
  serializeResult: (data) => {
    const metadata = data.aweme_list?.[0];
    const result = new Object();
    result.title = metadata.desc;
    result.create_time = new Date(metadata.create_time * 1000).toString();
    result.author = new Object();
    result.author.id = metadata.author.uid;
    result.author.nickname = metadata.author.nickname;
    result.author.signature = metadata.author.signature;
    result.author.followings = metadata.author.following_count;
    result.author.followers = metadata.author.follower_count;
    result.author.avatar = metadata.author.avatar_larger.url_list[1];
    result.music = new Object();
    result.music.id = metadata.music.id;
    result.music.title = metadata.music.title;
    result.music.album = metadata.music.album;
    result.music.thumbnail = metadata.music.cover_hd.url_list[1];
    result.music.url = metadata.music.play_url.uri;
    result.video = metadata.video?.play_addr?.url_list.slice(0, -1);
    return result;
  }
};