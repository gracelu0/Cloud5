const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000
var app = express();


const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {res.render('pages/login')});


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


app.post('/signUpForm', (req,res) => {
    var insertUsername = req.body.username;
    var insertPassword = req.body.password;
    var confirm = req.body.confirmPassword;
    var insertEmail = req.body.email;

    if(insertPassword === confirm){
        continue;
    }
    else{
        alert('Passwords are not equal');
        res.redirect('back');
    }

    var insertquery = `INSERT INTO logindb(username, password, email) VALUES ('${insertUsername}', '${insertPassword}', '${insertEmail}') WHERE NOT EXISTS(SELECT username FROM logindb WHERE username = '${insertUsername}');`
    pool.query(insertquery, (error, result) => {
        if(error){
            res.end(error);
        }
        res.render('pages/login');
    });
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
