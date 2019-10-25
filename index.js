const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000
var app = express();



const { Pool } = require('pg');


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
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

