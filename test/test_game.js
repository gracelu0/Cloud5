var chai = require('chai')
    , expect = chai.expect
    , assert = chai.assert
    , should = chai.should();

var request = require('request'),
base_url = "http://localhost:5000";

var app = require('../game.js').app;
var Browser = require('zombie');

describe('server access', () =>{
    it("returns status code 200", (done)=>{
        request.get(base_url,(err,res,body)=>{
            assert.equal(200, res.statusCode);
            done();
            });
    });
});


describe('login page', function() {
    const browser = new Browser();

    before(function(done) {
        browser.visit('http://localhost:5000/',done);
    });

    describe('submits login form', function(){
        before(function(done){
            browser.fill('input[name="username"]', 'mojo123');
            browser.fill('input[name="pwd"]', '12345')
            browser.pressButton('signInBtn',done);
        });

        it('login should be successful', function(){
            browser.assert.success();
        })
    });

});

describe('login page', function() {
    const browser = new Browser();

    before(function(done) {
        browser.visit('http://localhost:5000/',done);
    });

    describe('incorrect password', function(){
        before(function(done){
            browser.fill('input[name="username"]', 'mojo123');
            browser.fill('input[name="pwd"]', 'wrongpwd');
            browser.pressButton('signInBtn', done);
        });

        it('login should fail', function(){
            browser.assert.success();
        })
    })
});

    // req = require('supertest')(base_url),
    // superagent = require('superagent');

    //     describe('Data', function () {

    //         it('should return status OK (200)', function(done) {

    //             req.post('/login')
    //                 .type('form')
    //                 .send({username:"mojo123",password:"123"})
    //                 .end(function(err, res) {
    //                     if (err) {
    //                         throw err;
    //                     }
    //                     assert.ok(res);
    //                     assert.ok(res.body);
    //                     assert.equal(res.status, 200);
    //                     done();
    //         });
    //     });
    // });

var players = require('../game.js').players;
var playerCount = require('../game.js').playerCount;
describe('players', ()=>{
    it('object', ()=>{
        expect(players).to.be.an('object');
    });

    it('player count is same as players length',()=>{
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