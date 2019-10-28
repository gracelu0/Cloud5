const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000

var app = express();
const bcrypt = require('bcrypt');

const { Pool } = require('pg');
var pool = new Pool({
    connectionString: process.env.DATABASE_URL
  //connectionString: 'postgres://postgres:1234@localhost/logindb'
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('pages/login');
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

    pool.query(loginQuery, async (error, result) => {

        if (error)
            res.end(error);

        if (result.rows.length === 0)
            res.render('pages/login', {loginMessage: 'Username entered does not match any accounts! Please sign up for a new account below.'});

        else{
            if(await bcrypt.compare(userpwd, result.rows[0].password)){
                if (result.rows[0].usertype == 'User')
                    res.render('pages/home', {message: 'Successfully logged in!'});
                else // result.row[0].usertype == 'Admin'
                    res.render('pages/admin', {message: 'Successfully logged in as an admin!'});
            }
            else 
                res.render('pages/login', {loginMessage: 'Password entered is incorrect! Please try again.'});
        }
    });
});


app.post('/signUpForm', async (req,res) => {

    var insertUsername = req.body.username;
    var insertPassword = req.body.password;
    var confirm = req.body.confirmPassword;
    var insertEmail = req.body.email;

    if(insertPassword !== confirm){
        res.render('pages/signUp', {message: 'Passwords do not match!'});
    }
    else{
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    var insertquery = `INSERT INTO logindb(username, password, email) VALUES ('${insertUsername}', '${hashedPassword}', '${insertEmail}');`
    pool.query(insertquery, (error, result) => {
        if(error){
            return res.render('pages/signUp', {message: 'Username already taken!'});
        }
        return res.render('pages/login', {signupMessage: 'New user created!'});
    });
  }
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
