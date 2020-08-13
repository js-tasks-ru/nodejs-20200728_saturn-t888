const url = require('url');
const http = require('http');
const path = require('path');
const fs = require ('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  let filePath = '';

  // Проверка, декодирование и нормализация запроса для последующего чтения файла
  switch (checkRequest (req)) {
    case 400:
      res.statusCode = 400;
      res.end ('Bad request!');
      break;
    case 404:
      res.statusCode = 404;
      res.end ('File not found.');
      break;
    case 405:
      res.statusCode = 405;
      res.end ('Method ' + req.method + ' is not allowed.');
      break;
    case 500:
      res.statusCode = 500;
      res.end (req.url + ' is not a file.');
      break;
    default: filePath = checkRequest (req); break;
  }

  // Чтение и отдача файла
  fsStream = fs.createReadStream (filePath);
  fsStream.on ('error', (err) => {
    res.statusCode = 404;
    res.end ('File not found.');
  })
  fsStream.pipe (res);

});

/* Все проверки запроса вынесены в отдельную функцию */
var checkRequest = function (req, res) {
  // Проверка метода
  if (req.method !== 'GET') {return 405;}

  // Проверка пути
  const pathName = url.parse (req.url).pathname.slice (1); // console.log ('pathName = ' + pathName);
  if (!!path.parse (pathName).dir) {return 400;}


  // Полный путь к файлу
  const filePath = path.normalize (path.join (__dirname, 'files', decodeURIComponent(pathName))); // console.log ('filepath = ' + filePath);
  
  // Не удалось понять, почему эта проверка у меня не срабатывает...
  fs.stat (filePath, function (err, stats) {
    if (err || !stats.isFile ()) {return 500;}
  });
  
  return filePath;
}

module.exports = server;
