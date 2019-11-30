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
                .send({'username': 'test', 'password':'123', 'confirmPassword':'1234','email':'grace.r.luo@gmail.com'})
                .end(function(err, res){
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    done();
                });
        });
    })
    
    it('should log user out when logout button clicked and user confirms', (done)=>{
        chai.request(app)
            .post('/logout')
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });



});


describe('login page', function() {
    const browser = new Browser({site:'http://localhost:5000/' });
    before(function(){
    })

    before(function(done) {
        browser.visit('/',done);
    });

    it('should show login form', function(){
        assert.ok(browser.success);
    })

    describe('submits login form', function(){
        before(function(done){
            browser.fill('input[name="username"]', 'mojo123');
            browser.fill('input[name="pwd"]', '12345')
            browser.pressButton('signInBtn',done);
        });

        it('should allow successful login if username and password exist', function(){
            browser.assert.success();
        })
    });

});

describe('login page', function() {
    const browser = new Browser();

    before(function(done) {
        browser.visit('http://localhost:5000/',done);
    });

    describe('signup', function(){
        before(function(done){
            browser.pressButton('button[name="signUpBtn"]').then(function(){
                assert.ok(browser.success);
                assert.equal(browser.text('h1'),'SIGN UP');
                browser.fill('input[name="username"]', 'mojo321');
                browser.fill('input[name="password"]', '123');
                browser.fill('input[name="confirmPassword"]', '123');
                browser.fill('input[name="email"]', 'grace.r.luo@gmail.com');
                
            }).then(done,done);
        });
    })


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
    var client1, client2;
    it('should connect users', function (done) {
        var client1 = io(socketURL);
        var client2 = io(socketURL);
      
      client1.on('connect', function (data) {
          client1.emit('playerMoved')

        client1.disconnect();
        done();
      });
    });

    // it('should broadcast new player to all players', function(done){

    // })

    it('socket tests', ()=>{
        function test_movement(client){
            client.on('playerMoved', (data)=>{
                assert.isNumber(data.x);
                assert.isNumber(data.y);
            })
        }

        function test_playerHit(client){
            client.on('playerHit', (id)=>{
                assert.isAtLeast(players[id].health,0);
            })
        }

        function tests(client){
            test_movement(client);
    
        }

        var client1 = io(socketURL);
        var client2 = io(socketURL);
        tests(client1);
        tests(client2);
    });

  });