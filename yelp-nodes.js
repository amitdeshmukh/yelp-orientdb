//------------------------------------------------
// This script creates nodes in OrientDB
//
// Data is within a JSON formatted input file 
// with one record per line
//------------------------------------------------

// declare some variables
var counter = 0; var record = 0;  
// require dependencies
var LineByLineReader = require('line-by-line');  
// include backend stuff
var OrientDB = require('./orientdb-backend.js');  
// create an instance of Class
var orient = new OrientDB;  
// create a line-by-line object. process.argv[2] contains the input filename
var lr = new LineByLineReader(process.argv[2], {encoding: 'utf8', skipEmptyLines: true        });

// on error
lr.on('error', function (err){  
    console.log('an error occured :' + err);
    process.exit(1);
});

// on eof
lr.on('end', function () {  
    console.log('All lines are read, file is closed now.');
});

// on line
lr.on('line', function (line){  
    // increment counter
    counter += 1;
    record += 1;

    // check that line contains valid JSON
    try {
        var obj = JSON.parse(line);
    } catch (e) {
        console.log('ERROR : not JSON --> '+ line);
        process.exit(1);
    }
    console.log('Read record ' + record + ' --> ' + obj.name);

    // if we read 10 lines, pause emitting new line events
    if (counter == 10) {
        lr.pause();
        counter = 0; // reset counter
    };
    setTimeout(function(){
        lr.resume();
    }, 10);
    // create a new node with class 'business'
        orient.createNode('business', obj);
});
