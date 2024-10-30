const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routers/userRoutes.js');
const { createTable } = require('./controllers/userController');

const app = express();
app.use(bodyParser.json());

app.use('/api', userRoutes); 

createTable().then(() => {
  app.listen(2000, () => {
    console.log('API rodando na porta 2000');
  });
});
