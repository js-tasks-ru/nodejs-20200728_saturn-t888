const server = require('./server');

server.listen(4000,'localhost', () => {
  console.log('Server is listening on http://localhost:4000');
});
