const url = require('url');
const http = require('http');
const path = require('path');
const fs = require ('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  let filePath = '';

  /* Проверка, декодирование и нормализация запроса для последующего удаления файла */
  switch (checkRequest (req)) {
    case 400:
      res.statusCode = 400;
      res.end ('Bad request!');
      return;
    case 404:
      res.statusCode = 404;
      res.end ('File does not exists.');
      return;
    case 405:
      res.statusCode = 405;
      res.end ('Method ' + req.method + ' is not allowed.');
      return;
    default:
      filePath = checkRequest (req); break;
  }

  fs.unlinkSync (filePath, (err) => {
    if (err.code === 'ENOENT') {
      res.statusCode = 404;
      return res.end ('File not found.');
    } else {
      res.statusCode = 500;
      res.end ('Internal error.');
    }
  });

  res.statusCode = 200;
  res.end ('File ' + filePath + ' was deleted.');

});

/* Все проверки запроса вынесены в отдельную функцию */
var checkRequest = function (req) {
  
  // Проверка метода
  if (req.method !== 'DELETE') {return 405;}

  // Проверка пути
  const pathName = url.parse (req.url).pathname.slice (1); //console.log ('pathName = ' + pathName);
  if (!!path.parse (pathName).dir) {return 400;}

  // Полный путь к файлу
  const filePath = path.normalize (path.join (__dirname, 'files', decodeURI (pathName))); //console.log ('filePath = ' + filePath);

  // Проверка наличия файла
  if (!fs.existsSync (filePath)) {return 404;}

  return filePath;

}

module.exports = server;
