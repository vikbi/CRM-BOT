var util = require('util');
var _ = require('lodash');
var builder = require('botbuilder');

module.exports = function list(session, info) {
    session.send('getting the Whitelabels List...');

var rows = '';
getWhitelabels(function(err,result){
rows = _.chunk(result, 3).map(group =>
                ({
                    'type': 'ColumnSet',
                    'columns': group.map(asWLItem)
                }));
        // session.conversationData.api_url = info.api_url;
        // console.log(session.conversationData.api_url);
            var card = {
                'contentType': 'application/vnd.microsoft.card.adaptive',
                'content': {
                    'type': 'AdaptiveCard',
                    'body': [
                        {
                            'type': 'TextBlock',
                            'text': 'Welcome! Please select the CRM Whitelabel',
                            'weight': 'bolder',
                            'size': 'large'
                        },
                    ].concat(rows)
                }
            };

            var msg = new builder.Message(session)
                .addAttachment(card);

            session.send(msg);
            session.endDialog();

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

function asWLItem(wl) {
    return {
         'type': 'Action.Submit',
        'size': '20',
        'items': [
            {
                'type': 'TextBlock',
                'horizontalAlignment': 'center',
                'wrap': false,
                'weight': 'bolder',
                'text': wl.name,
            },
            {
                'type': 'Image',
                'size': 'auto',
                'url': wl.logo
            }
        ],
        'selectAction': {
            'type': 'Action.Submit',
            'data': _.extend({ type: 'wlSelection' }, wl)
        }
    };
}

