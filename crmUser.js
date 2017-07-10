var util = require('util');
var _ = require('lodash');
var builder = require('botbuilder');

module.exports = function list(session, info) {
    session.send('getting the Whitelabels List...');

var rows = '';
getWhitelabels(function(err,result){
    var rows = '';
    // console.log(result);
    session.conversationData.wl = result;
            var rows = result.map(function(r){ return r.name });
            console.log(rows);
            builder.Prompts.choice(session,
            'you have following list of available CRM.',
            rows,
            { listStyle: builder.ListStyle.button });

});
};



function getWhitelabels(callback) {
var mysql = require('mysql');
var con = mysql.createConnection({
   host: process.env.host,
  user: process.env.user,
  password: process.env.password,
   database: "crmbot"
 });
 con.connect(function(err) {
  if (err) return callback(err);
   con.query("SELECT * FROM whitelabels ", function (err, result, fields) {
     if (err){
         return callback(err);
     }

     if(result){ 
        return callback(null,result);
     }
  });
 });
}


