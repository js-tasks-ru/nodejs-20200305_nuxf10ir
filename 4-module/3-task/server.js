const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');


const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const {dir} = path.parse(pathname);


  switch (req.method) {
    case 'DELETE':

      if (!!dir) {
        res.statusCode = 400;
        res.end('Is Folder');
        return;
      }

      fs.unlink(filepath, (err) => {
        if (err && err.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('File not exists');
        }
        res.statusCode = 200;
        res.end('Deleted');
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
