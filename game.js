const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const PORT = process.env.PORT || 5000

var app = express();
const bcrypt = require('bcrypt');

const { Pool } = require('pg');
var pool = new Pool({
  connectionString: process.env.DATABASE_URL;
  //connectionString: 'postgres://postgres:shimarov6929@localhost/cloud5'
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('pages/login');
});

app.get("/changePwd", function (req, res) {
  res.render("pages/changePwd");
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
                if ((result.rows[0].usertype == 'User') && (result.rows[0].confirmation_status === 1))
                    res.render('pages/home', {message: 'Successfully logged in!'});
                else if (result.rows[0].confirmation_status !== 1)
                  res.render('pages/login', {mailError: 'Email is not confirmed'});
                else{ // result.row[0].usertype == 'Admin'
                    var usersQuery=`SELECT userid, username, email, usertype FROM logindb`;
                    pool.query(usersQuery, (error, result) =>{
                        if (error)
                            res.end(error);
                        var allUsers = {'rows': result.rows};
                        res.render('pages/admin', allUsers);
                    });
                }
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
    const mailCode = randomstring.generate(20);
    if(insertPassword !== confirm){
        res.render('pages/signUp', {message: 'Passwords do not match!'});
    }
    else{
        let transporter  = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: 'cloud5sfu@gmail.com',
            pass: 'cmpt276cloud5'
          }
        });
        let mailOptions = {
          from: '"Cloud5" cloud5sfu@gmail.com',
          to: insertEmail,
          subject: "Email confirmation",
          text: "Please, confirm the email. The confirmation code is: " + mailCode
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error){
            return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
        });
        res.render('pages/mailConfirm', {insertUsername, insertPassword, insertEmail, mailCode});
  }
});

app.post('/mailCodeForm', async(req,res) => {
  var mailCode = req.body.code;
  var insertUsername = req.body.name;
  var insertEmail = req.body.email;
  var pwd = req.body.pwd;
  var codeInput = req.body.mailCodeInput;
  const salt = await bcrypt.genSalt();
  const insertPassword = await bcrypt.hash(pwd, salt);
  if(codeInput === mailCode){
    var insertquery = `INSERT INTO logindb(username, password, email, confirmation_code) VALUES ('${insertUsername}', '${insertPassword}', '${insertEmail}', '${mailCode}');`;
    pool.query(insertquery, (error, result) => {
        if(error)
          res.end(error);
    res.render('pages/login');
    });
  }
  else{
    res.render('pages/mailConfirm', {confirmationErr: 'Wrong confirmation code', insertUsername, insertPassword, insertEmail, mailCode});
    }
});

// app.post('/changePwdAction', (req,res) => {
//   var codeInput = req.body.changePwdCodeInput;
//   var name = req.body.changePwdName;
//   var newPwd = req.body.newPwd;
//   const changePwdCode = randomstring.generate(20);
//   var getMailQuery=`SELECT * FROM logindb WHERE username = '${name}'`;
//   pool.query(getMailQuery, (error, result) => {
//       if (error)
//           res.end(error);
//         console.log(result.rows[0].email);
//         let transporter  = nodemailer.createTransport({
//           host: 'smtp.gmail.com',
//           port: 465,
//           secure: true,
//           auth: {
//             user: 'cloud5sfu@gmail.com',
//             pass: 'cmpt276cloud5'
//           }
//         });
//
//         let mailOptions = {
//           from: '"Cloud5" cloud5sfu@gmail.com',
//           to: result.rows[0].email,
//           subject: "Change password",
//           text: "Your confirmation code for changing your password: " + changePwdCode
//         };
//
//         transporter.sendMail(mailOptions, (error, info) => {
//           if (error){
//             return console.log(error);
//           }
//           console.log('Message %s sent: %s', info.messageId, info.response);
//         });
//         res.render("pages/changePwdConfirmation", {changePwdCode});
//         // if (changePwdCode === codeInput){
//         //   var changePwd = `UPDATE logindb SET password = '${newPwd}' WHERE username = ${asd}`
//         //   pool.query(deleteUserQuery, (error, result) => {
//         // }
//
//         // pool.query(getMailQuery, (error, result) => {
//         //     if (error)
//         //         res.end(error);
//
//   });
// });


// app.post('/changePwdConfirmationAction', (req,res) => {
//   console.log(changePwdCode);
// });


app.get('/removeUser/:userID', (req,res) => {

    var deleteUserQuery=`DELETE FROM logindb WHERE userid = ${req.params.userID}`;

    pool.query(deleteUserQuery, (error, result) => {
        if (error)
            res.end(error);

        var usersQuery=`SELECT userid, username, email, usertype FROM logindb`;

        pool.query(usersQuery, (error, result) =>{
            if (error)
                res.end(error);

            var allUsers = {'rows': result.rows};
            res.render('pages/admin', allUsers);
        });
    });
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
