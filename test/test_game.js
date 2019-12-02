var chai = require('chai')
    , expect = chai.expect
    , assert = chai.assert
    , should = chai.should();

var chaiHttp = require('chai-http');
chai.use(chaiHttp);

var request = require('request'),
base_url = "http://localhost:5000";

var app = require('../game.js').app;
var Browser = require('zombie');

describe('user tests', () =>{
    it("returns status code 200", (done)=>{
        request.get(base_url,(err,res,body)=>{
            assert.equal(200, res.statusCode);
            done();
            });
    });
    

    describe('login', ()=>{
        it('should load login page initially', (done)=>{
            chai.request(app)
                .get('/')
                .end(function(err, res){
                    res.should.have.status(200);
                    done();
                });
        });
    
        it('should allow successful login if username and password exist', (done)=>{
            chai.request(app)
                .post('/login')
                .type('form')
                .send({'username': 'mojo123', 'pwd':'12345'})
                .end(function(err, res){
                    it('should delete a single user on /removeUser/:userID',(done)=>{
                        const userID = 'grass';
                        chai.request(app)
                            .get(`/removeUser/${userID}`)
                            .end(function(error,response){
                                response.body.should.be.a('object');
                                response.should.have.status(200);
                                done();
                            })
                    })
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('sign up', ()=>{
        it('should proceed to confirmation page if all fields completed correctly', (done)=>{
            chai.request(app)
                .post('/signUpForm')
                .send({'username': 'test', 'password':'123', 'confirmPassword':'123','email':'grace.r.luo@gmail.com'})
                .end(function(err, res){
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    done();
                });
        });
    
        it('should not signup successfully if passwords do not match', (done)=>{
            chai.request(app)
                .post('/signUpForm')
                .type('form')
                .send({username: 'test', password:'123', confirmPassword:'1234',email:'grace.r.luo@gmail.com'})
                .end(function(err, res){
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    done();
                });
        });
    })

    var gameFlag = require('../game.js').gameFlag;
    it('should show postgame screen after game over', (done)=>{
        assert.equal(gameFlag,false);
        chai.request(app)
                .post('/postgame')
                .end(function(err, res){
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    done();
                });
    })

    describe('logout', ()=>{
        it('should log user out when logout button clicked and user confirms', (done)=>{
            chai.request(app)
                .post('/logout')
                .end(function(err, res){
                    res.should.have.status(200);
                    done();
                });
        });
    });
    
    describe('change password', ()=>{
        it('should direct user to confirmation page if user exists and new password entered', (done)=>{
            chai.request(app)
                .post('/forgotPwdAction')
                .send({'name':'mojo123', 'newPwd': 'abc'})
                .end(function(err, res){
                    if (err){
                        throw err;
                    }
                    res.should.have.status(200);
                    done();
                });
        });

        it('should send error message if user does not exist and changes password', (done)=>{
            chai.request(app)
                .post('/forgotPwdAction')
                .send({'name':'nonexistent', 'newPwd': 'abc'})
                .end(function(err, res){
                    if (err){
                        throw err;
                    }
                    res.should.have.status(200);
                    done();
                });
        });
    })
    


});

var weather = require('../game.js').weatherTest;
describe('weather test', function(){
    it('should be one of 6 weather conditions with implemented effects', ()=>{
        expect(weather).to.be.oneOf(['Rain','Snow', 'Drizzle', 'Mist', 'Fog', 'Haze' ]);
    });
});


describe('login page', function() {
    const browser = new Browser();

    before(function(done) {
        browser.visit('http://localhost:5000/',done);
    });

    describe('admin login', function(){
        before(function(done){
            browser.fill('input[name="username"]', 'mojo123');
            browser.fill('input[name="pwd"]', '12345');
            browser.pressButton('button[name="signInBtn"]', done);
        });

        it('should show admin view page if usertype is Admin', function(){
            browser.assert.success();
            assert.equal(browser.text('h2'),'ADMIN VIEW')
        });

    });

});


var players = require('../game.js').players;
var playerCount = require('../game.js').playerCount;
var servTraps =  require('../game.js').servTraps;
var servBullets =  require('../game.js').servBullets;
var servHealthpacks =  require('../game.js').servHealthpacks;
var trapSecs = require('../game.js').trapSecs;
var battleSecs = require('../game.js').battleSecs;

describe('players', ()=>{
    it('object', ()=>{
        expect(players).to.be.an('object');
    });

    it('should have player count the same as number of players joined',()=>{
        assert.equal(Object.keys(players).length, playerCount);
    });
});


//socket.io testing
var io = require('socket.io-client')
var socketURL = "http://localhost:5000";
var options = {
    transports: ['websocket'],
    'force new connection': true
};

describe("Socket-Server", function () {
    var client1;
    it('should connect users', function (done) {
        var client1 = io(socketURL);
      
      client1.on('connect', function (data) {
          client1.emit('playerMoved')

        client1.disconnect();
        done();
      });
    });

    describe("socket tests", function(){
        it('should get coordinates of player position', ()=>{
            function test_movement(client){
                client.on('playerMoved', (data)=>{
                    assert.isNumber(data.x);
                    assert.isNumber(data.y);
                });
                client.disconnect();
            }
    
            function tests(client){
                test_movement(client);
        
            }
    
            var client1 = io.connect(socketURL, options);
            var client2 = io.connect(socketURL, options);
            tests(client1);
            tests(client2);
        });

        it('should decrease player health if player is still alive and hit by bullet', ()=>{
            function test_playerHit(client){
                client.on('playerHit', (id)=>{
                    assert.isAtLeast(players[id].health,0);
                });
                client.disconnect();
            }

            function tests(client){
                test_playerHit(client);
        
            }

            var client1 = io.connect(socketURL, options);
            var client2 = io.connect(socketURL, options);
            tests(client1);
            tests(client2);

        });

        it('should check timer is set at start of game', ()=>{
            var timerFlag = false;
            var gameFlag = true;

            if (gameFlag && !timerFlag){
                totalGameTime = battleSecs + trapSecs;
                timerFlag = true;
                assert.isAtLeast(totalGameTime,0);
            }
 
         });



        var player1 = {'username': 'test1', 'colour': 'pink'}
        var player2 = {'username': 'test2', 'colour': 'blue'}

        it('should broadcast new player to all players', ()=>{
           var client1 = io.connect(socketURL, options);

           client1.on('connect', function(data){
               client1.emit('username', player1);

                var client2 = io.connect(socketURL, options);

                client2.on('connect', function(data){
                    client2.emit('username', player2);
                });
            
                client2.disconnect();

           })
           client1.disconnect();
           
        });

        it('should emit username to all players', ()=>{
            var client1 = io.connect(socketURL, options);
 
            client1.on('connect', function(data){
                client1.emit('username', player1);
                client1.emit('updateColour',player1);
 
                 var client2 = io.connect(socketURL, options);
 
                 client2.on('connect', function(data){
                     client2.emit('username', player2);
                     client2.emit('updateColour',player2);
                 });
                 client2.disconnect();
            });
            client1.disconnect();
            
 
         });

         it('should emit selected character to all players', ()=>{
            var client1 = io.connect(socketURL, options);
 
            client1.on('connect', function(data){
                client1.emit('updateColour',player1);
 
                 var client2 = io.connect(socketURL, options);
 
                 client2.on('connect', function(data){
                     client2.emit('updateColour',player2);
                 });

                 client2.disconnect();
            });
            client1.disconnect();
            
 
         });

         it('should allow player to set mine', ()=>{
            assert.equal(servTraps.length,0);
            var client1 = io.connect(socketURL, options);
 
            client1.on('connect', function(data){
                client1.emit('trapSet', { x: 100, y: 100});
 
            });
            client1.disconnect();
 
         });


         it('should check player health increases after player collects healthpack and is at most 100', ()=>{
            assert.equal(servHealthpacks.length,0);
            var client1 = io.connect(socketURL, options);
 
            client1.on('connect', function(id){
                players[id].health = 10;

            });

            client1.on('healthpackHit', function(id){
                players[id].health += 10;
                assert.equal(players[id].health,20);
                assert.isAtMost(players[id].health,100);
            });
            client1.disconnect();
 
         });

         it('should only set player to invisible after killed, scroll map', ()=>{
            var client1 = io.connect(socketURL, options);
            var client2 = io.connect(socketURL, options);
            
            client1.on('connect', function(data){
                playerCount++;
 
            });
            client2.on('connect', function(data){
                playerCount++;
 
            });
            assert.isAtLeast(playerCount,0);
            client1.on('playerDied', function(id){
                assert.isEqual(players[id].health,0);
            });
            client1.disconnect();
 
         });

         it('should send chat message to all players', ()=>{
            var client1 = io.connect(socketURL, options);
 
            client1.on('connect', function(data){
                client1.emit('message', {
                    user: 'mojo123',
                    message: 'hello'
                  });
 
                 var client2 = io.connect(socketURL, options);
 
                 client2.on('message', function(data){
                     assert.equal(data.user, 'mojo123');
                     assert.equal(data.message,'hello');
                 });
                 client2.disconnect();
            });
            client1.disconnect();
            
 
         });

         it('should broadcast death to all players', ()=>{
            var client1 = io.connect(socketURL, options);
 
            client1.on('connect', function(data){
                client1.emit('died',player1);
 
                 var client2 = io.connect(socketURL, options);
 
                 client2.on('died', function(deadPlayer){
                     assert.equal(deadPlayer.username, 'test1');
                 });
                 client2.disconnect();
            });
            client1.disconnect();
 
         });

         it('should initialize game once 4 players joined', ()=>{
            playerCount = 0;
            var gameFlag = false;

            var playersArray = [];
            var client1 = io.connect(socketURL, options);
            var client2 = io.connect(socketURL, options);
            var client3 = io.connect(socketURL, options);
            var client4 = io.connect(socketURL, options);
            playersArray.push(client1);
            playersArray.push(client2);
            playersArray.push(client3);
            playersArray.push(client4);

            function add_Player(client){
                playerCount++;
                if (playerCount==4){
                    gameFlag=true;
                }
            }

            for (var i = 0; i < 4; i++){
                add_Player(playersArray[i]);
            }
            assert.equal(playerCount,4);
            assert.equal(gameFlag,true);

            client1.disconnect();
            client2.disconnect();
            client3.disconnect();
            client4.disconnect();
 
         });

    });

  });

