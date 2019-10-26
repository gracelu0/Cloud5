const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000
var app = express();
const bcrypt = require('bcrypt');

const flash = require('connect-flash');
app.use(flash());

const { Pool } = require('pg');
var pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

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

app.post('/login', (req, res) => {
    var userID = req.body.username;
    var userpwd = req.body.pwd;
    var loginQuery = `SELECT * FROM logindb WHERE username='${userID}'`;
<<<<<<< HEAD:index.js
    pool.query(loginQuery, async (error, result) => {
=======

    // function flashrequest(res) {
    //     res.flash('success', "Login Successful!");
    // }

    pool.query(loginQuery, (error, result) => {
>>>>>>> 2e9efeda74d68a96a08a0e4a2b70dbb738cb5f92:game.js

        if (error)
            res.end(error);

        if(result.rows.length === 0)
            console.log("not a regular user");

        else
            if(await bcrypt.compare(userpwd, result.rows[0].password)) {
                console.log("Successful login");
                res.render('pages/home');
                // res.render('pages/home', {message: flashrequest(res)});
            }
            else {
                res.send("Password and username do not match");
            }
    });
});


app.post('/signUpForm', async (req,res) => {

    var insertUsername = req.body.username;
    var insertPassword = req.body.password;
    var confirm = req.body.confirmPassword;
    var insertEmail = req.body.email;

    if(insertPassword !== confirm){
        res.send("Passwords do not match");
        return res.render('pages/signUp');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    console.log(salt);
    console.log(hashedPassword);

    var insertquery = `INSERT INTO logindb(username, password, email) VALUES ('${insertUsername}', '${hashedPassword}', '${insertEmail}');`
    pool.query(insertquery, (error, result) => {
        if(error){
            res.send("Username is taken!");
            return res.render('pages/signUp');
        }
        res.render('pages/login');
    });
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

