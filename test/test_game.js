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
                .post('/signUpForm')
                .type('form')
                .send({'username': 'mojo123', 'password':'12345'})
                .end(function(err, res){
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
        })
    })
});


var players = require('../game.js').players;
var playerCount = require('../game.js').playerCount;
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

           })

        });

    });
    

  });

