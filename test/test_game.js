var chai = require('chai')
    , expect = chai.expect
    , assert = chai.assert
    , should = chai.should();

var request = require('request'),
    base_url = "http://localhost:5000";

describe('server access', () =>{
    describe("GET /", ()=>{
        it("returns status code 200", (done)=>{
            request.get(base_url,(err,res,body)=>{
                assert.equal(200, res.statusCode);
                done();
            });
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
