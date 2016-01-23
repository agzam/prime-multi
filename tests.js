var main = require('./main.js'),
    Rx = require('rx'),
    assert = require('assert');

describe('Prime numbers', ()=> {
    var ps$ = main.primes$();

    it('first 10', ()=> {
        ps$.take(10).bufferWithCount(10).subscribe((x)=> {
            assert.deepEqual(x, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
        });
    });

 
    it('at 1000', ()=> {
        ps$.skip(999).take(3).bufferWithCount(3).subscribe((x)=> {
            assert.deepEqual(x, [7919, 7927, 7933]); // Correctness ensured. courtesy of WolframAlpha
        });
    });
});
