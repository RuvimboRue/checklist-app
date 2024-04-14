import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'checklist',
});

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Handle GET request to retrieve user signups
    connection.query('SELECT * FROM users', function (error, results) {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.status(200).json(results);
      }
    });
  } else if (req.method === 'POST') {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }
    // Handle POST request to add a new user signup
    connection.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password],
      function (error, results) {
        if (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal Server Error' });
        } else {
          res.status(200).json({ message: 'User added successfully' });
        }
      }
    );
  } else if (req.method === 'PUT') {
    // Handle PUT request to update a user signup
    const { id } = req.query;
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }
    connection.query(
      'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
      [username, email, password, id],
      function (error, results) {
        if (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal Server Error' });
        } else {
          res.status(200).json({ message: 'User updated successfully' });
        }
      }
    );
  } else if (req.method === 'DELETE') {
    // Handle DELETE request to delete a user signup
    const { id } = req.query;
    connection.query('DELETE FROM users WHERE id = ?', [id], function (error, results) {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'User deleted successfully' });
      }
    });
  }else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}