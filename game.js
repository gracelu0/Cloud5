const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const PORT = process.env.PORT || 5000
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var players = {};

const bcrypt = require('bcrypt');

const { Pool } = require('pg');

var pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('pages/login');
});

app.get("/forgotPwd", function (req, res) {
  res.render("pages/forgotPwd");
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
    var selectedCharacter = req.body.character;
    console.log(selectedCharacter);
    res.render('pages/game', {character: selectedCharacter});
});

app.post('/postgame', (req,res) => {
    res.render('pages/postgame');
});

app.post('/logout', (req,res) =>{
  res.render('pages/login');
})

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
                if ((result.rows[0].usertype == 'User'))
                    res.render('pages/home', {message: 'Successfully logged in!'});
                else{ // result.row[0].usertype == 'Admin'


                    var usersQuery=`SELECT userid, username, email, usertype FROM logindb ORDER BY usertype, username`;
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
      getAllquery =  `SELECT * FROM logindb WHERE username='${insertUsername}'`;
      pool.query(getAllquery, (error, result) => {
        if(error)
          res.end(error);
        if (result.rows.length === 0){
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
            text: "Please confirm your email to finish creating your account. Your confirmation code is: " + mailCode
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error){
              return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
          });
          res.render('pages/mailConfirm', {insertUsername, insertPassword, insertEmail, mailCode});
        }
        else{
            res.render('pages/signUp', {usernameMessage: 'Username already exists!'});
        }
      });
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
    res.render('pages/login',{signupMessage: 'Account created!'});
    });
  }
  else{
    res.render('pages/mailConfirm', {confirmationErr: 'Wrong confirmation code', insertUsername, insertPassword, insertEmail, mailCode});
    }
});

app.post('/forgotPwdAction', (req,res) => {
  var codeInput = req.body.forgotPwdCodeInput;
  var name = req.body.forgotPwdName;
  var newPwd = req.body.newPwd;
  const forgotPwdCode = randomstring.generate(20);
  var loginQuery = `SELECT * FROM logindb WHERE username='${name}'`;
  pool.query(loginQuery, async (error, result) => {
      if (error)
          res.end(error);
      if (result.rows.length === 0)
          res.render('pages/forgotPwd', {loginMessage: 'Username entered does not match any accounts! Please try again.'});
      else{
        var getMailQuery=`SELECT email FROM logindb WHERE username = '${name}'`;
        pool.query(getMailQuery, (error, result) => {
            if (error)
                res.end(error);
              console.log(result.rows[0].email);
              let transporter  = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                  user: 'cloud5sfu@gmail.com',
                  pass: 'cmpt276cloud5'
                }
              });
              console.log(result.rows[0].email);
              console.log(name);
              let mailOptions = {
                from: '"Cloud5" cloud5sfu@gmail.com',
                to: result.rows[0].email,
                subject: "Change password",
                text: "Your confirmation code for changing your password: " + forgotPwdCode
              };

              transporter.sendMail(mailOptions, (error, info) => {
                if (error){
                  return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
              });
              res.render("pages/forgotPwdConfirmation", {forgotPwdCode, name, newPwd});
            });
          }
        });
});


app.post('/forgotPwdConfirmationAction', async (req,res) => {
  var name = req.body.name;
  var newPwd = req.body.newPwd;
  var forgotPwdCode = req.body.forgotPwdCode;
  var codeInput = req.body.forgotPwdCodeInput;
  const salt = await bcrypt.genSalt();
  const hashedNewPwd = await bcrypt.hash(newPwd, salt);
  if (forgotPwdCode === codeInput){
    var forgotPwd = `UPDATE logindb SET password = '${hashedNewPwd}' WHERE username = '${name}'`
    pool.query(forgotPwd, (error, result) => {
      if (error)
       res.end(error);
    res.render('pages/login',{forgotMessage: 'Password changed!'});
  });
}
  else{
    res.render('pages/forgotPwdConfirmation', {confirmationErr: 'Wrong confirmation code', name, newPwd, forgotPwdCode});
  }
});


app.get('/removeUser/:userID', (req,res) => {
    var deleteUserQuery=`DELETE FROM logindb WHERE userid = ${req.params.userID}`;

    pool.query(deleteUserQuery, (error, result) => {
        if (error)
            res.end(error);

        var usersQuery=`SELECT userid, username, email, usertype FROM logindb ORDER BY usertype, username`;

        pool.query(usersQuery, (error, result) => {
            if (error)
                res.end(error);

            var allUsers = {'rows': result.rows};
            res.render('pages/admin', allUsers);
        });
    });
});

var players = {};
var servBullets = [];

io.on('connection', function (socket) {
  console.log('a user connected');
  // create a new player and add it to our players object
  players[socket.id] = {
    x: 500,
    y: 500,
  //x: Math.floor(Math.random() * 700) + 50,
  //y: Math.floor(Math.random() * 500) + 50,
    colour: "pink",
    playerId: socket.id,
    username: socket.username,
  }

  socket.on('updateColour', function (colourData) {
    players[socket.id].colour = colourData.colour;
    socket.broadcast.emit('updateSprite', players[socket.id]);
  });

  //send players object to new player
  socket.emit('currentPlayers', players);

  //update all other players of new player
  socket.broadcast.emit('newPlayer', players[socket.id]);

  socket.on('disconnect', function () {
    console.log('user disconnected');
    delete players[socket.id];
    io.emit('disconnect', socket.id);
  });

  socket.on('playerMovement', function (movementData) {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    players[socket.id].rotation = movementData.rotation;
    socket.broadcast.emit('playerMoved', players[socket.id]);
  });

  socket.on('message', function(data){
    console.log("catched")
    console.log(data);
    io.emit('message', data);
  })
  socket.on('disconnect', function () {
    io.emit('disconnect');
  });

  socket.on('bulletFire', function (bulletInit) {
    var newBullet = bulletInit;
    newBullet.x = bulletInit.x;
    newBullet.y = bulletInit.y;
    newBullet.initX = bulletInit.initX;
    newBullet.initY = bulletInit.initY;
    newBullet.owner = socket.id;
    servBullets.push(newBullet);
    socket.broadcast.emit('bulletFired', newBullet);
  });

  socket.on('playerDied', function (deadPlayer){
    var counter = 0;
    delete players[deadPlayer.id];
    for(var id in players){
      if(id === deadPlayer.id){
        players.splice(counter, 1);
      }
      counter ++;
    }
  });
});

function gameLoop(){
  for(var i = 0; i < servBullets.length; i++){
    var currBullet = servBullets[i];
    if(currBullet){
      currBullet.x += currBullet.xSpeed;
      currBullet.y += currBullet.ySpeed;

      for(var id in players){
        if(currBullet.owner != id){
          var dx = players[id].x - currBullet.x;
          var dy = players[id].y - currBullet.y;
          var dist = Math.sqrt(dx*dx + dy*dy);
          if(dist < 30){
            io.emit('player-hit', id);
            servBullets.splice(i,1);
            i--;
          }
        }
      }

      if(currBullet.x < -10 || currBullet.x < currBullet.initX - 500 || currBullet.x > currBullet.initX + 500 || currBullet.y < -10 || currBullet.y < currBullet.initY - 500 || currBullet.y > currBullet.initY + 500){
        servBullets.splice(i,1);
        i--;
      }
    }
  }

  io.emit('bulletsUpdate', servBullets);
}

setInterval(gameLoop, 16);

server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
