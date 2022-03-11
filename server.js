const express = require('express');
const path = require('path');
const uuid = require('./helpers/uuid');
const fs = require('fs');
const termData = require('./db/db.json');
const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
  });

  app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data);

      res.json(parsedNotes);
    }});
  } )

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });

  app.post('/api/notes', (req, res) => { 
    console.info(`${req.method}`);  

  const { title, text } = req.body;
  if (title && text) {
    // Variable for the object we will save
const newNote = {
      title,
      text,
      note_id: uuid(),
    };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
  
          // Add a new note
          parsedNotes.push(newNote);
  
          // Write updated notes back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
          );
        }
      });

  const response = {
        status: 'success',
        body: newNote
      };
      console.log(response);
    res.status(200).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
})

  app.listen(PORT, () => { 
    console.log(`Example app listening at http://localhost:${PORT}`);
  });
  