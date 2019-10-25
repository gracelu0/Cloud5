const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000
var app = express();

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    var userID=req.body.uname;
    var loginQuery = `SELECT * FROM logindb WHERE username='${userID}'`;
    pool.query(loginQuery, (error, result) => {
        if (error)
            res.end(error);
        
        var userIDs={'rows': result.rows};

        if (!Array.isArray(tokimons['rows']) || !tokimons['rows'].length)
            res.end("User is not in db!");

        else
            res.render('pages/home');        
    })

});

app.post('/home', (req,res) => {
    res.render('pages/home');
});

app.post('/signUp', (req,res) => {
    res.render('pages/signUp');
});

// app.post('/dreamTeam', (req,res) => {
//   pool.query(`SELECT * FROM Tokemon ORDER BY total DESC LIMIT 3;`, (err, result)=> {
//     console.log(req);
//     if (err)
//       res.end(err);
//     console.log("The champion is showed");
//     var results = {'rows': result.rows };
//     res.render('pages/dreamTeam', results);
//     });
//   });

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
