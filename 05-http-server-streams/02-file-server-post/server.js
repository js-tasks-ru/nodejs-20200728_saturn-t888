const url = require('url');
const http = require('http');
const path = require('path');
const fs = require ('fs');
const limitSizeStream = require ('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
    
  let filePath = '';
 
  /* Проверка, декодирование и нормализация запроса для последующей записи файла */
  switch (checkRequest (req)) {
    case 400:
      res.statusCode = 400;
      res.end ('Bad request!');
      return;
    case 405:
      res.statusCode = 405;
      res.end ('Method ' + req.method + ' is not allowed.');
      return;
    case 409:
      res.statusCode = 409;
      res.end ('File exists.');
      return;
    default: filePath = checkRequest (req); break;
  }

  req.on ('aborted', () => {
    writeFile.destroy ();
    fs.unlink (filePath, (err) => {});
  });

  const writeFile = fs.createWriteStream (filePath);
  const limit = new limitSizeStream ({limit: 1000000});

  writeFile.on ('finish', () => {
    res.statusCode = 201;
    res.end ('Done.');
  });
  writeFile.on ('error', () => {
    res.statusCode = 500;
    res.end ('Internal error.');
  });
  
  limit.on ('error', (err) => {
    writeFile.destroy ();
    fs.unlink (filePath, (err) => {});
    res.statusCode = 413;
    res.end ('File is too big.');
    return;
  });

  req.pipe (limit).pipe (writeFile);
 
});

/* Все проверки запроса вынесены в отдельную функцию */
var checkRequest = function (req) {

  // Проверка метода
  if (req.method !== 'POST') {return 405;}

  // Проверка пути
  const pathName = url.parse (req.url).pathname.slice (1); // console.log ('pathName = ' + pathName);
  if (!!path.parse (pathName).dir) {return 400;}

  // Полный путь к файлу
  const filePath = path.normalize (path.join (__dirname, 'files', decodeURIComponent(pathName))); // console.log ('filepath = ' + filePath);
  
  // Проверка наличия файла
  if (fs.existsSync (filePath)) {return 409;}
  
  return filePath;
}

module.exports = server;
