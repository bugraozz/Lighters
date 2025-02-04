import { Pool } from 'pg';

const pool = new Pool({
  user: 'myuser',
  host: 'localhost',
  database: 'mydb',
  password: String('mypassword'), // Ensure password is a string
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Veritabanı bağlantı hatası:', err.stack);
  }
  console.log('Veritabanına başarıyla bağlanıldı');
  release(); // Client'ı serbest bırak
});

const db = {
  query: (text, params) => pool.query(text, params),
};

export default db;




