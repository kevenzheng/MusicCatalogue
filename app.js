const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

// CRITICAL: Middleware to parse form submissions (req.body)
app.use(express.urlencoded({ extended: true }));

// Mock Database (Changed to 'let' so we can modify the array)
let songs = [
    { id: 1, artist: "The Weeknd", song: "Save Your Tears", album: "After Hours", dateAdded: "2026-05-01" },
    { id: 2, artist: "Bruno Mars", song: "Grenade", album: "Doo-Woops & Hooligans", dateAdded: "2026-05-15" },
    { id: 3, artist: "Taylor Swift", song: "Blank Space", album: "1989", dateAdded: "2026-05-10" },
    { id: 4, artist: "Kendrick Lamar", song: "HUMBLE.", album: "DAMN.", dateAdded: "2026-05-20" }
];

// Read All
// Change this route in your server.js
app.get('/', (req, res) => {res.render('index')});
app.get('/catalogue', (req, res) => res.render('catalogue', { songs }));
app.get('/randomizer', (req, res) => res.render('randomizer', { songs }));
app.get('/search', (req, res) => res.render('search', { songs }));
app.get('/about', (req, res) => res.render('about'));

// ACTION: Edit Song (Update)
app.post('/songs/edit/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { artist, song, album } = req.body; // These must match the 'name' attributes in your HTML form!
    
    songs = songs.map(s => s.id === id ? { ...s, artist, song, album } : s);
    res.redirect('/catalogue');
});

// ACTION: Add New Song (Create)
app.post('/songs/add', (req, res) => {
    const { artist, song, album } = req.body;
    
    // Generate a unique ID based on the highest existing ID
    const newId = songs.length > 0 ? Math.max(...songs.map(s => s.id)) + 1 : 1;
    
    // Capture current date for the "RECENTLY ADDED" sorting function
    const today = new Date().toISOString().split('T')[0]; 

    songs.push({
        id: newId,
        artist,
        song,
        album,
        dateAdded: today
    });

    res.redirect('/catalogue');
});

// ACTION: Delete Song (Destroy)
app.get('/songs/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);
    songs = songs.filter(s => s.id !== id);
    res.redirect('/catalogue');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});