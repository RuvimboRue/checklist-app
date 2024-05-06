import mysql from 'mysql';

const connection = mysql.createConnection({
  host: '192.168.0.41',
  user: 'root',
  password: '',
  database: 'checklist',
});

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], function (error, results) {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const user = results[0];
      const userId = user.id;

      res.status(200).json({ message: 'Login successful', user: { id: userId, username: user.username } }); // Include username in response
    });
   
  } else if (req.method === 'GET') {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'Please provide user ID' });
    }

    connection.query('SELECT username FROM users WHERE id = ?', [userId], function (error, results) {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const username = results[0].username;

      res.status(200).json({ username });
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}