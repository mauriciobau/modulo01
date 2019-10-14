const express = require('express');

const server = express();

server.use(express.json());

// Query params = ?teste=1
// Route params = /user/1
// Request body = { "name": "Juca", "email": "juca@email.com" }
// Headers = { "locale": "pt_br" }

// server.get('/teste', (req, res) => {
//   const nome = req.query.nome;

//   return res.json({ message: `Ola ${nome}`});
// });

const users = ['Juca', 'Joca', 'Jeca'];

server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd('Request');
});

function checkUserExisits(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }

  return next();
}

function checkUserInArray(req, res,next) {
  const user = users[req.params.index];

  if (!user){
    return res.status(400).json({ error: "User does not exists" });
  }

  req.user = user;

  return next();
}

server.get('/users', (req, res) => {
  return res.json(users);
});

server.get('/users/:index', checkUserInArray, (req, res) => {
  return res.json(req.user);
});

server.post('/users', checkUserExisits, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put('/users/:index', checkUserExisits, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

server.listen(3333);