const monk = require ('monk');

const url = "mongodb://root123:1234@cluster0-shard-00-00-iveed.mongodb.net:27017,cluster0-shard-00-01-iveed.mongodb.net:27017,cluster0-shard-00-02-iveed.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";

const db = monk(url);
module.exports=db;