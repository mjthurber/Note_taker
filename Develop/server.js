const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const api = require('./routes/index.js');
const fs = require('fs');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', api)

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/db/db.json'))

);

//* `POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).

app.post('/api/notes', (req, res) => {
  // Read existing notes from the db.json file
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf8'));

  // Create a new note object with a unique ID based on timestamp
  const newNote = {
    id: Date.now(), // Generate a unique ID based on timestamp
    title: req.body.title,
    text: req.body.text
    // Assuming req.body contains 'title' and 'text' properties for the new note
  };

  // Add the new note to the existing notes array
  notes.push(newNote);

  // Write the updated notes array back to the db.json file
  fs.writeFileSync(path.join(__dirname, '/db/db.json'), JSON.stringify(notes));

  // Respond with the newly created note
  res.json(newNote);
});

app.delete('/api/notes/:id', async (req, res) => {
  const noteId = req.params.id;

  try {
    const filePath = path.join(__dirname, '/db/db.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    let notes = JSON.parse(jsonData);

    const updatedNotes = notes.filter(note => note.id !== noteId); // Filter out the note to be deleted

    await fs.writeFile(filePath, JSON.stringify(updatedNotes, null, 2)); // Update db.json file

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note.' });
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} ʕ•́ᴥ•̀ʔっ`)
);
