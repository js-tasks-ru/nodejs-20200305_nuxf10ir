const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      fs.createReadStream(filepath)
          .on('error', (error) => {
            if (error.code === 'ENOENT') {
              const {dir} = path.parse(pathname);
              if (!!dir) {
                res.statusCode = 400;
                res.end('Is Folder');
              } else {
                res.statusCode = 404;
                res.end('Not exists');
              }
            } else {
              res.statusCode = 500;
              res.end('Server error');
            }
          })
          .pipe(res);

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
