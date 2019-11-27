var chai = require('chai')
    , expect = chai.expect
    , assert = chai.assert
    , should = chai.should();

    var request = require('request'),
    base_url = "http://localhost:5000";

describe('server access', () =>{
    it("returns status code 200", (done)=>{
        request.get(base_url,(err,res,body)=>{
            assert.equal(200, res.statusCode);
            done();
            });
    });
});


var players = require('../game.js').players;
var playerCount = require('../game.js').playerCount;
describe('players', ()=>{
    it('object', ()=>{
        expect(players).to.be.an('object');
    });
});

describe('player count', ()=>{
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
    it('user connected', function (done) {
      var client = io(socketURL);
      client.on('connect', function (data) {
        done();
      });
    });
  });