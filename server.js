const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
//bhash usage
const bcrypt = require('bcrypt');
const { log } = require('console');
const saltRounds = 10;
const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  // Ensure this points to your views folder

// Since `sqlite3` has `.verbose()` chained, you'll need to add this after importing:

const db = new sqlite3.Database('todo_list.db');

// Middleware for parsing form data (URL-encoded) and JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // For handling JSON data
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }  // Set secure: true in production
}));

app.post('/register', (req, res) => {
    
    //destructuring username and password from request body,
    //which is sent by the client via form
   
    const { uname, psw } = req.body;
     
   // Hash the password
   bcrypt.hash(psw, saltRounds, function(err, hash) {
    if(err) {
        return res.status(500).json({ message: 'Error hashing password'});
    }
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [uname, hash], function (err) {
        if (err) {
            return res.status(500).json({ message: 'User already exists or another error' });
        }
    
        // Store the hashed password in the database   
            return res.json({ message: 'User registered successfully' });
        });
    });
});

//Login Route
app.post('/login', (req, res) => {
            
         const { uname, psw } = req.body;
         console.log('post login route hit');
         // Fetch the user by username
     db.get('SELECT * FROM users WHERE username = ?', [uname], (err, row) => {
         if (err || !row) {      
             return res.status(400).json({ message: 'Invalid credentials' });
         }
 // Compare the hashed password with the one stored in the database
 bcrypt.compare(psw, row.password, function(err, result) {
     if (result) {
         req.session.userId = row.id;  // Save user ID in the session
         // Redirect to the user's todo list page
         res.redirect(`/todo/${req.session.userId}`);
//This code is testing a successful login. 
// return res.json({ message : 'login successful', userId: row.id});

     } else {
         res.status(400).json({ message: 'Invalid credentials' });
     }
 });
 });
});





//Middleware to check to see if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next(); //User is authenticated, continue to next route handler
    }
    res.status(401).json({ message: 'Please log in first' });
};

// Get all to-do items for the logged-in user
// Tested on Postman and returned Please log in first
app.get('/', isAuthenticated, (req, res) => {
const userId = req.session.userId;  
db.all('SELECT * FROM todos WHERE user_id = ?', [userId], (err, rows) => {
    if (err) {
        return res.status(500).send(err.message);
    }
        // Render the `todo` EJS template and pass the todos as data
        res.render('index', { todos: rows });
        //when i type index instead of todo, it shows the page, with no styling and the register buttons again
});
});


// Route to get the todo list for a specific user
app.get('/todo/:id', isAuthenticated, (req, res) => {
    const userId = req.params.id; // Get user ID from the URL parameter
    db.all('SELECT * FROM todos WHERE user_id = ?', [userId], (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        // Render the `todo` EJS template and pass the todos as data
        res.render('index', { todos: rows }); // Ensure you have a `todo.ejs` view to render
    });
});


app.get('/', (req, res) => {
    res.render('index', { todos: [] });  // Pass data like 'todos' or other variables as needed
    });

  

// Create a new to-do item (only for authenticated users)
//Tested on Postman and returned please log in first
app.post('/add', isAuthenticated, (req, res) => {
    // console.log('post add route hit');
    // res.json({ message: 'Test' });
    const { item } = req.body;
    const userId = req.session.userId;
    if (!item) {
        return res.status(400).json({ error: 'Item is required' });
    }

    db.run('INSERT INTO todos (item, completed, user_id) VALUES (?, ?, ?)', [item, false, userId], function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json({ id: this.lastID, item, completed: false });
    });
});







// Update a to-do item (mark as completed)
app.put('/todo/:id', isAuthenticated, (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    // Validate input
    if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Invalid completed status' });
    }

    db.run('UPDATE todos SET completed = ? WHERE id = ?', [completed, id], function(err) {
        if (err) {
            console.error(err); // Log the error
            return res.status(500).send(err.message);
        }
        res.sendStatus(200);
    });
});



// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

//Testing Code

//This code wil get all the tables
app.get('/tables', (req, res) => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving tables' });
        }
        res.json(tables);
    });
});
   

//This code gets all of the users

app.get('/users', (req, res) => {
    const query = 'SELECT username FROM users';
    
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching users' });
        }
        
        // Send back the list of usernames
        res.json(rows);
    });
});

//This code gets all of the passwords

app.get('/passwords', (req, res) => {
    const query = 'SELECT password FROM users';
    
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching paassword' });
        }
        
        // Send back the list of usernames
        res.json(rows);
    }); 
});

//Checks users table
app.get('/check-users-table', (req, res) => {
    db.all("PRAGMA table_info(users)", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving table info' });
        }
        res.json(rows);
    });
});
