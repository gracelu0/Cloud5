const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const PORT = process.env.PORT || 5000
const assert = require('assert');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

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

var gameFlag = false;
var blockPlayersFlag = false;
var rankingViewSecs = 10;

app.post('/pregame', (req,res) => {
  if (!gameFlag && !blockPlayersFlag){
    res.render('pages/pregame');
  }
  else{
    assert.deepStrictEqual(blockPlayersFlag, true);
    res.render('pages/gip', {refreshTimeEst: totalGameTime + rankingViewSecs});
  }
});

app.post('/waitForPlayers', (req,res) => {
  res.render('pages/gameStaging');
});

app.post('/game', (req,res) => {
  if (!gameFlag)
    gameFlag = true;
  res.render('pages/game');
});

app.post('/postgame', (req,res) => {
  assert.deepStrictEqual(gameFlag, false)
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
        else{

            var usersQuery=`SELECT userid, username, email, usertype FROM logindb ORDER BY usertype, username`;
            pool.query(usersQuery, (error, result) =>{

                if (error)
                    res.end(error);
                var allUsers = {'rows': result.rows};
                res.render('pages/admin', allUsers);
            });
        }
      }
      else{
        res.render('pages/login', {loginMessage: 'Password entered is incorrect! Please try again.'});
      }
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

        if(error){
          res.end(error);
        }
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

        if (error){
          res.end(error);
        }

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
          to: result.rows[0].email,
          subject: "Change password",
          text: "Your confirmation code for changing your password: " + forgotPwdCode
        };

        transporter.sendMail(mailOptions, (error, info) => {

          if (error){
            return console.log(error);
          }
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

      if (error){
       res.end(error);
      }
    res.render('pages/login',{forgotMessage: 'Password changed!'});
    });
  }
  else{
    res.render('pages/forgotPwdConfirmation', {confirmationErr: 'Wrong confirmation code', name, newPwd, forgotPwdCode});
  }
});


app.get('/removeUser/:userID', (req,res) => {
  console.log(req.params.userID);
  var deleteUserQuery=`DELETE FROM logindb WHERE userid = ${req.params.userID}`;
  pool.query(deleteUserQuery, (error, result) => {

    if (error){
      res.end(error);
    }

    var usersQuery=`SELECT userid, username, email, usertype FROM logindb ORDER BY usertype, username`;
    pool.query(usersQuery, (error, result) => {

      if (error){
        res.end(error);
      }

      var allUsers = {'rows': result.rows};
      res.render('pages/admin', allUsers);
    });
  });
});

var weatherTest = "Rain"
var playerCount = 0;
var playerAlive = 0;
var players = {};
var aliveIds = [];
var servBullets = [];
var servTraps = [];
var servHealthpacks = [];
var trapSecs = 30; var battleSecs = 120;
var totalGameTime; timerFlag = false;
var ranking = [];
var rankingFlag = true;
var isDraw = 0;

io.on('connection', function (socket) {
  playerCount++;
  playerAlive = playerCount;

  //Empty rankings array
  ranking = [];
  isDraw = 0;
  console.log('a user connected. Num of players: ' + playerCount);


  if (playerCount == 4){
    blockPlayersFlag = true;
    if (gameFlag && !timerFlag){
      totalGameTime = battleSecs + trapSecs;
      timerFlag = true;
      var trapTimer = setInterval(function() {
        io.sockets.emit('trapTimer', { countdown: totalGameTime-battleSecs });

        if (totalGameTime-battleSecs < 1){
          totalGameTime++;
          clearInterval(trapTimer);
          var battleTimer = setInterval(function(){
            io.sockets.emit('battleTimer', { countdown: totalGameTime });

            if(totalGameTime <= 1 && rankingFlag == true){
              rankingFlag = false;
              totalGameTime = 10;
              for(var i = 0; i < ranking.length; i ++){
                const removed = ranking[i];
                aliveIds.splice(aliveIds.indexOf(removed), 1);
              }
              var tie = '';
              for(var j = 0; j < aliveIds.length; j ++){
                console.log(tie);
                tie += aliveIds[j];
                if(j !== (aliveIds.length - 1)){
                  tie += ', ';
                  ranking.push(' ');
                }
              }
              ranking.push(tie);
              io.emit('rankings', ranking);
            }

            if (totalGameTime < 1 && rankingFlag == false){
              clearInterval(battleTimer);
              gameFlag = false; timerFlag = false;
              blockPlayersFlag = false;
            }
            totalGameTime--;
          }, 1000)
        }
        totalGameTime--;
      }, 1000);
    }
  }

  io.sockets.emit('numPlayers', playerCount);
  // create a new player and add it to our players object
  players[socket.id] = {
    //x: 1400,
    //y: 1325,
    x: Math.floor(Math.random() * 326) + 1075,
    y: Math.floor(Math.random() * 326) + 1000,
    colour: socket.colour,
    playerId: socket.id,
    playerUsername: socket.username
  }

  //send players object to new player
  socket.emit('currentPlayers', players);

  //update all other players of new player
  socket.broadcast.emit('newPlayer', players[socket.id]);

  socket.on('updateColour', function (colourData) {
    socket.colour = colourData.colour;
    players[socket.id].colour = colourData.colour;
    socket.broadcast.emit('updateSprite', players[socket.id]);
  });

  socket.on('username', function(username){
    socket.username = username;
    players[socket.id].playerUsername = username;
    aliveIds.push(username);
  });

  socket.on('playerMovement', function (movementData) {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    socket.broadcast.emit('playerMoved', players[socket.id]);
  });

  socket.on('message', function(data){
    io.emit('message', data);
  });

  socket.on('bulletFire', function (bulletInit) {
    var newBullet = bulletInit;
    newBullet.x = bulletInit.x;
    newBullet.y = bulletInit.y;
    newBullet.initX = bulletInit.initX;
    newBullet.initY = bulletInit.initY;
    newBullet.owner = socket.id;
    servBullets.push(newBullet);
  });

  socket.on('bulletMovement', function (bulletsInfo){
    for(var i = 0; i < bulletsInfo.length; i++){
      servBullets[i].x = bulletsInfo[i].x;
      servBullets[i].y = bulletsInfo[i].y;
    }
  });

  socket.on('trapSet', function (trapInit) {
    var newTrap = trapInit;
    newTrap.x = trapInit.x;
    newTrap.y = trapInit.y;
    newTrap.owner = socket.id;
    servTraps.push(newTrap);
  });

  socket.on('healthpackSet', function (healthpackInit){
    var newHealthpack = healthpackInit;
    newHealthpack.x = healthpackInit.x;
    newHealthpack.y = healthpackInit.y;
    servHealthpacks.push(newHealthpack);
  });

  socket.on('healthpackDespawn', function(){
    for(var i = 0; i < servHealthpacks.length; i++){
      servHealthpacks.splice(i,1);
      i--;
    }
  });

  socket.on('playerDied', function (deadPlayer){
    playerAlive--;
    var username = deadPlayer.username;
    console.log(username + " was killed");
    //Push dead player username to rankings array
    ranking.push(username);
    console.log(ranking);

    io.sockets.emit('numPlayers', playerAlive);
    //emit dead player username to client for rankings
    // io.emit('rankings', username);
    //console.log("dead player is emitted to client for rankings")
    io.emit('died', deadPlayer);
    delete players[deadPlayer.id];
    console.log(totalGameTime);

    if ((playerAlive==1 || !playerAlive) && gameFlag){
      totalGameTime = rankingViewSecs;
      for(var i = 0; i < 3; i ++){
        const removed = ranking[i];
        aliveIds.splice(aliveIds.indexOf(removed), 1);
      }
      ranking.push(aliveIds[0]);
      io.emit('rankings', ranking);
    }
    
  });

  socket.on('disconnect', function (){
    playerCount--;
    console.log('user disconnected. Num of players: ' + playerCount);
    if (playerAlive > playerCount)
      playerAlive--;

    for(var i = 0; i < servTraps.length; i++){
      if(servTraps[i].owner == socket.id){
        servTraps.splice(i,1);
        i--;
      }
    }
    delete players[socket.id];
    io.sockets.emit('numPlayers', playerCount);
    io.emit('disconnect', socket.id);

    if (playerCount==1 && gameFlag){
      totalGameTime = 1;
      io.emit('rankings', ranking);
    }
    else if(playerCount==0 && !gameFlag)
      totalGameTime = 0;
  });
});

function gameLoop(){
  for(var i = 0; i < servBullets.length; i++){
    var currBullet = servBullets[i];
    if(currBullet && servBullets[i]){
      currBullet.x += currBullet.xSpeed;
      currBullet.y += currBullet.ySpeed;

      for(var id in players){
        if(currBullet.owner != id){
          var dx = players[id].x - currBullet.x;
          var dy = players[id].y - currBullet.y;
          var dist = Math.sqrt(dx*dx + dy*dy);
          if(dist < 30){
            io.emit('playerHit', id);
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

  for(var i = 0; i < servTraps.length; i++){
    var currTrap = servTraps[i];
    if(currTrap && servTraps[i]){
      for(var id in players){
        if(currTrap.owner != id){
          var dx = players[id].x - currTrap.x;
          var dy = players[id].y - currTrap.y;
          var dist = Math.sqrt(dx*dx + dy*dy);
          if(dist < 20){
            io.emit('trapHit', id, currTrap.x, currTrap.y);
            servTraps.splice(i,1);
            i--;
          }
        }
      }
    }
  }

  for(var i = 0; i < servHealthpacks.length; i++){
    var currHealthpack = servHealthpacks[i];
    if(currHealthpack && servHealthpacks[i]){
      for(var id in players){
        var dx = players[id].x - currHealthpack.x;
        var dy = players[id].y - currHealthpack.y;
        var dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 20){
          io.emit('healthpackHit',id);
          servHealthpacks.splice(i,1);
          i--;
        }
      }
    }
  }

  io.emit('bulletsUpdate', servBullets);
  io.emit('trapsUpdate', servTraps);
  io.emit('healthpacksUpdate', servHealthpacks);
}

setInterval(gameLoop, 16);


if(!module.parent){
  server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
}

//testing
module.exports = {
  players: players,
  playerCount: playerCount,
  app: app,
  servTraps: servTraps,
  servHealthpacks: servHealthpacks,
  servBullets: servBullets,
  weatherTest: weatherTest
}
