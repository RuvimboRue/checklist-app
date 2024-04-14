import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'checklist',
});

export default function handler(req, res) {
  //functions for the checklist item
  if (req.method === 'GET') {
    // Handle GET request to retrieve checklist items
    connection.query('SELECT form.id FROM form WHERE id = ?', [form_id], function (error, results) {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.status(200).json(results);
      }
    });
  } else if (req.method === 'POST') {
    // Handle POST request to add a new comment item
    const { comment } = req.body;
    connection.query('INSERT INTO checklist (comment) VALUES (?)', [comment], function (error, results) {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'Item added successfully' });
      }
    });
  } 
    
  //code to check if the checkbox is ticked
  // else if (req.method === 'PUT' && req.url === '/api/form') {
    // Handle PUT request to update item status
    // const { id, comment } = req.body; // Get all necessary fields

    // connection.query(
    //   'UPDATE checklist SET comment = ? WHERE id = ?',
    //   [comment, id], // Update checklist and comment
  //     (error, results) => {
  //       if (error) {
  //         console.error(error);
  //         res.status(500).json({ message: 'Internal Server Error' });
  //       } else {
  //         res.status(200).json({ message: 'Item updated successfully' });
  //       }
  //     }
  //   );
  // }
  else if (req.method === 'PUT') {
    // Handle PUT request to edit a checklist item
    const { id } = req.query; // Use req.query to access URL parameters
    const { item } = req.body;
    connection.query('UPDATE checklist SET item = ? WHERE id = ?', [item, id], function (error, results) {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'Item updated successfully' });
      }
    });
  }
}
