const express = require('express');
const { addUser, disconnectUser, getStatus, Consultar, getduracao } = require('../controllers/userController');

const router = express.Router();

router.post('/connect', addUser); 
router.post('/disconnect', disconnectUser);
router.get('/status', getStatus);
router.get('/online-count', Consultar);
router.post('/session-duracao', getduracao);


module.exports = router;
