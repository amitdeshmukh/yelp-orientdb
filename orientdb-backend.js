// require dependencies
var Oriento = require('oriento');  
var async = require('async');

// constructor for Class OrientDB
function OrientDB(){  
    // configure orientdb client - ensure you change the username and password here
    this.server = Oriento({
      host: 'localhost',
      port: 2424,
      username: 'username',
      password: 'password'
    });

    // we will connect to a database named 'yelp-test'
    try {
        this.db = this.server.use('yelp-test');
    } catch (e) {
            console.log('ERROR : database error --> '+ e);
            process.exit(1);    
    }
    console.log('Using database: ' + this.db.name);
}

//----------------- class methods ------------------


//--------------------------------------------------
// function createNode -- creates a node (or vertex)
// inputs:
//         orientClass --> name of orientDb Vertex class to use
//         data        --> a JSON formatted record

OrientDB.prototype.createNode = function(orientClass, data){  
    this.db.insert().into(orientClass).set(data).one()
        .then(function(data) {
            console.log('Stored record --> ', data.name);
        }, function(error){
            console.log('ERROR : record ' + error);
        });
}

//--------------------------------------------------
// function lookupIndex -- lookup an index
// inputs:
//         indexName   --> the name of the index to lookup
//         key         --> the key to be looked up
//        callback    --> the callback function
// outputs:
//        returns @rid (orientdb record_id) to callback

OrientDB.prototype.lookupIndex = function(indexName, key, callback) {  
    this.db.index.get(indexName)
    .then(function (index){
        index.get(key)
            .then(function (result){
                var record_id = '#' + result.rid.cluster + ':' + result.rid.position;
                return record_id;
            })
            .then(function (res){
                callback(res);
            });
    })
    .catch(function (err){
        console.error('error : ', err.message);
        process.exit(1);
    });
}

//--------------------------------------------------
// function createEdge -- creates an edge (or relationship)
// this function leverages index LookupIndex for speedy lookups
// inputs:
//         fromIndex   --> name of orientDb From index
//        fromKey     --> From Vertex key to be lookedup 
//        toIndex     --> name of orientDb To index
//        toKey       --> To Vertex key to be lookedup
//         data        --> a JSON formatted record

OrientDB.prototype.createEdge = function(fromIndex, fromKey, toIndex, toKey, data){  
    var fromRID = 'a';
    var toRID = 'b';

    var adb = this.db; // because db is undefined in async

    async.waterfall([
        function(callback){
            adb.index.get(fromIndex)
            .then(function (index){
                index.get(fromKey)
                    .then(function (result){
                        var record_id = '#' + result.rid.cluster + ':' + result.rid.position;
                        callback(null, record_id);
                    })
            })
        }
        ,

        function(fromRID, callback){
            adb.index.get(toIndex)
            .then(function (index){
                index.get(toKey)
                    .then(function (result){
                        var record_id = '#' + result.rid.cluster + ':' + result.rid.position;
                        callback(null, fromRID, record_id);
                    })
            })
        }
        ,

        function(fromRID, toRID, callback){
            adb.create('edge', 'reviewed_by')
              .from(fromRID)
              .to(toRID)
              .set(data)
              .commit()
              .one()
              .then(function (result){
                callback(null, 'edge created --> ' + JSON.stringify(result['@rid']));
              });

        }
        ],
        function (err, result) {
            if (err){console.log(err)}
            if (result){console.log(result)}
        }
    );
}
module.exports = OrientDB;
