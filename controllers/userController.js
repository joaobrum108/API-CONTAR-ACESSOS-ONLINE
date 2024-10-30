const { format: dateFormat } = require('date-fns');
const openDb = require('../configDB.js');

let dbInstance = null;

async function getDbConnection() {
  if (!dbInstance) {
    dbInstance = await openDb();
    console.log('Nova conexão com o banco de dados criada.');
  }
  return dbInstance;
}

function formatDate(date) {
  return dateFormat(date, 'yyyy-MM-dd HH:mm:ss');
}

async function createTable() {
  const db = await getDbConnection();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_guid TEXT NOT NULL,
      connect_time TEXT NOT NULL,
      disconnect_time TEXT,
      status TEXT NOT NULL DEFAULT 'online'
    )
  `);
  console.log('Tabela user_sessions criada (se não existia).');
}

async function Consultar(req, res) {
  const db = await getDbConnection();
  try {
    const result = await db.get('SELECT count(*) as n FROM user_sessions WHERE status = "online"');
    res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao consultar usuários online:', error.message);
    res.status(500).send('Erro ao consultar usuários online.');
  }
}

async function addUser(req, res) {
  const { user_guid } = req.body;
  console.log('Recebido user_guid:', user_guid);
  const db = await getDbConnection();
  const connect_time = formatDate(new Date());
  try {
    await db.run('INSERT INTO user_sessions (user_guid, connect_time, status) VALUES (?, ?, ?)', [user_guid, connect_time, 'online']);
    res.status(200).send('Usuário conectado.');
  } catch (error) {
    console.error('Erro ao conectar usuário:', error.message);
    res.status(500).send('Erro ao conectar usuário.');
  }
}

async function disconnectUser(req, res) {
  const { user_guid } = req.body;
  const db = await getDbConnection();
  const disconnect_time = formatDate(new Date());
  try {
    await db.run('UPDATE user_sessions SET disconnect_time = ?, status = ? WHERE user_guid = ? AND status = "online"', [disconnect_time, 'offline', user_guid]);
    res.status(200).send('Usuário desconectado.');
  } catch (error) {
    console.error('Erro ao desconectar usuário:', error.message);
    res.status(500).send('Erro ao desconectar usuário.');
  }
}

async function getStatus(req, res) {
  const db = await getDbConnection();
  try {
    const rows = await db.all('SELECT user_guid, connect_time, disconnect_time, status FROM user_sessions');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao obter status dos usuários:', error.message);
    res.status(500).send('Erro ao obter status dos usuários.');
  }
}

async function removeOfflineUsers() {
  const db = await getDbConnection();
  try {
    await db.run('DELETE FROM user_sessions WHERE status = "offline"');
    console.log('Usuários offline removidos.');
  } catch (error) {
    console.error('Erro ao remover usuários offline:', error.message);
  }
}

async function getduracao(req, res) {
  const { user_guid } = req.body;
  const db = await getDbConnection();
  try {
    const result = await db.get('SELECT connect_time, disconnect_time FROM user_sessions WHERE user_guid = ? ORDER BY id DESC LIMIT 1', [user_guid]);
    if (result && result.disconnect_time) {
      const connectTime = new Date(result.connect_time);
      const disconnectTime = new Date(result.disconnect_time);
      const durationSegundos = (disconnectTime - connectTime) / 1000; // duração em segundos
      res.status(200).json({ durationSegundos });
    } else {
      res.status(404).send('Usuário não encontrado ou ainda está online.');
    }
  } catch (error) {
    console.error('Erro ao calcular a duração da sessão:', error.message);
    res.status(500).send('Erro ao calcular a duração da sessão.');
  }
}

module.exports = {
  createTable,
  addUser,
  disconnectUser,
  getStatus,
  removeOfflineUsers,
  Consultar,
  getduracao
};
