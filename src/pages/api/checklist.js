import mysql from 'mysql';

const connection = mysql.createConnection({
  host: '192.168.0.41',
  user: 'root',
  password: '',
  database: 'checklist',
});

export default function handler(req, res) {
  //functions for the checklist item
  //update
  if (req.method === 'GET') {
    // Handle GET request to retrieve checklist items
    const { filter } = req.query;
    let sql = 'SELECT * FROM checklist';

    // Modify the SQL query based on the filter option
    if (filter === 'daily') {
      sql += ' WHERE filter = "daily"';
    } else if (filter === 'weekly') {
      sql += ' WHERE filter = "weekly"';
    } else if (filter === 'monthly') {
      sql += ' WHERE filter = "monthly"';
    }

    connection.query(sql, function (error, results) {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.status(200).json(results);
      }
    });
  } else if (req.method === 'POST') {
    // Handle POST request to add a new checklist item
    const { item, filter } = req.body;
    connection.query('INSERT INTO checklist (item, filter) VALUES (?, ?)', [item, filter], function (error, results) {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'Item added successfully' });
      }
    });
  } else if (req.method === 'DELETE') {
    // Handle DELETE request to delete a checklist item
    const { id } = req.query; // Use req.query to access URL parameters

    // Check if id exists

    connection.query('SELECT id FROM checklist WHERE id = ?', [id], function (error, results) {
      
      //database errors / problems
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Connection problem' });
      }

      // Check if list is not empty
      if (results.length === 0) {
        res.status(200).json({ message: 'Record missing' });
      }

    });


    // Perform deletion
    connection.query('DELETE FROM checklist WHERE id = ?', [id], function (error, results) {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'Item deleted successfully' });
      }
    });
  }else if (req.method === 'PUT') {
    const { id } = req.query; 
    const { comment, checkbox } = req.body; // Receive checkbox value
    const sql = `UPDATE checklist SET comment = ?, checkbox = ? WHERE id = ?`;
    connection.query(sql, [comment, checkbox, id], function (error, results) {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ message: 'Item not found or not updated' });
      } else {
        res.status(200).json({ message: 'Item updated successfully' });
      }
    });
  }
  
  else if (req.method === 'EDIT') {
    // Handle PUT request to edit a checklist item
    const { id } = req.query; // Use req.query to access URL parameters
    const { item } = req.body;
    connection.query('UPDATE checklist SET comment = ? WHERE id = ?', [item, id], function (error, results) {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'Item updated successfully' });
      }
    });
  }
  else if (req.method === 'PATCH') {
    // Handle PATCH request to clear comments for all, daily, weekly, or monthly tasks
    if (req.query.filter === 'all') {
        connection.query('UPDATE checklist SET comment = NULL', function (error, results) {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json({ message: 'Comments for all tasks cleared successfully' });
            }
        });
    } else if (req.query.filter === 'daily') {
        connection.query('UPDATE checklist SET comment = NULL WHERE filter = "daily"', function (error, results) {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json({ message: 'Comments for daily tasks cleared successfully' });
            }
        });
    } else if (req.query.filter === 'weekly') {
        connection.query('UPDATE checklist SET comment = NULL WHERE filter = "weekly"', function (error, results) {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json({ message: 'Comments for weekly tasks cleared successfully' });
            }
        });
    } else if (req.query.filter === 'monthly') {
        connection.query('UPDATE checklist SET comment = NULL WHERE filter = "monthly"', function (error, results) {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json({ message: 'Comments for monthly tasks cleared successfully' });
            }
        });
    } else {
        // Handle invalid filter option
        res.status(400).json({ message: 'Invalid filter option' });
    }
}

}
