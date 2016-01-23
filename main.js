var Rx = require('rx'),
    _ = require('lodash'),
    Table = require('cli-table'),
    ints = Rx.Observable.range(2, Infinity);

/**
 * Lazy seq of prime numbers
 * @return {Rx.Observable}
 */
function primes$() {
    return ints.flatMap(i => {
        var limit = Math.floor(Math.sqrt(i)); // supposedly integers should be faster than floats

        return ints.takeWhile(x => x <= limit)
            .some(x => (i % x) == 0)
            .map(x => {
                if (!x) return i; 
            })
            .filter(x => x); // drop undefined values
    });
}


function printTable(size) {
    var tbl = { cols: [], rows: [] };

    primes$()
        .take(size)
        .reduce((acc, n, i)=> { /* first we place all calculated prime numbers in `tbl.cols` */
            acc.cols[i] = n;

            return acc; 
        }, tbl)
        .reduce((acc, n, i)=> {
            _.times(size, (y)=> { /* now for every row we set array of multiplied values */
                acc.rows[y] = acc.cols.map((c)=> {
                    return c * acc.cols[y];
                });
                acc.rows[y].unshift(acc.cols[y]); /* for every row stick element of header onto Y-axis, so table would render nicely */
            });

            return acc;
        }, tbl)
        .do((tbl)=> {
            tbl.cols.unshift(''); // upper left corner element should be empty
            var table = new Table({ head: tbl.cols });

            tbl.rows.forEach((r)=> { table.push(r); });
            table.options.style.head = null; // no colors
            console.log(table.toString());
        })
        .subscribe();
}

module.exports = { primes$, printTable };
