const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const {dir} = path.parse(pathname);

  switch (req.method) {
    case 'POST':

      if (!!dir) {
        res.statusCode = 400;
        res.end('Is Folder');
        return;
      }

      const withLimitsStream = new LimitSizeStream({limit: 1024 * 1024});
      const fileWriteStream = fs.createWriteStream(filepath, {flags: 'wx'});


      res.on('close', () => {
        if (res.finished) return;
        fs.unlink(filepath, () => {});
      });

      fileWriteStream.on('error', ({code}) => {
        if (code === 'EEXIST') {
          res.statusCode = 409;
          res.end('Already exists');
        }
      });

      withLimitsStream.on('error', ({code}) => {
        if (code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end('Limit exceeds');
          fs.unlink(filepath, () => {});
        }
      });

      fileWriteStream.on('close', () => {
        res.statusCode = 201;
        res.end('Success');
      });

      req.pipe(withLimitsStream).pipe(fileWriteStream);
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
