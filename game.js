const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const path = require('path');
const PORT = process.env.PORT || 5000

var app = express();

const { Pool } = require('pg');
var pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
	saveUninitialized: false,
	resave: 'false',
	secret: 'This is for our flash messages'
}))
app.use(flash());

app.get('/', (req, res) => {
    res.render('pages/login')
});


app.post('/home', (req,res) => {
    res.render('pages/home');
});

app.post('/signUp', (req,res) => {
    res.render('pages/signUp');
});

app.post('/rules', (req,res) => {
    res.render('pages/rules');
});

app.post('/pregame', (req,res) => {
    res.render('pages/pregame');
});

app.post('/game', (req,res) => {
    res.render('pages/game');
});

app.post('/postgame', (req,res) => {
    res.render('pages/postgame');
});

app.post('/login', (req, res) => {
    var userID = req.body.username;
    var userpwd = req.body.pwd;
    var loginQuery = `SELECT * FROM logindb WHERE username='${userID}'`;

    pool.query(loginQuery, (error, result) => {

        if (error)
            res.end(error);

        if(result.rows.length === 0)
            console.log("not a regular user");

        else
            if(result.rows[0].password == userpwd) {
                console.log("Login successful");
                if (result.row[0].usertype == 'User')
                    res.render('pages/home');
                else // result.row[0].usertype == 'Admin'
                    res.render('pages/admin');


            }
            else {
                res.send("Password and username do not match");
            }
    });
});


app.post('/signUpForm', (req,res) => {
    var insertUsername = req.body.username;
    var insertPassword = req.body.password;
    var confirm = req.body.confirmPassword;
    var insertEmail = req.body.email;
    console.log(req.body);

    if(insertPassword !== confirm){
        res.send("Passwords do not match");
        return res.render('pages/signUp');
    }

    var insertquery = `INSERT INTO logindb(username, password, email) VALUES ('${insertUsername}', '${insertPassword}', '${insertEmail}');`
    pool.query(insertquery, (error, result) => {
        if(error){
            res.send("Username is taken!");
            return res.render('pages/signUp');
        }
        res.render('pages/login');
    });
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

