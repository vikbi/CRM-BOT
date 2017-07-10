// This loads the environment variables from the .env file
require('dotenv-extended').load();

var util = require('util');
var builder = require('botbuilder');
var restify = require('restify');
var _ = require('lodash');
var request = require('request');
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot and listen to messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());
var bot = new builder.UniversalBot(connector);
// var bot = new builder.UniversalBot(connector, function (session) {

//     if (session.message && session.message.value) {
//         // A Card's Submit Action obj was received
//         processSubmitAction(session, session.message.value);
//         return;
//     }
//     // var card = {
//     //     'contentType': 'application/vnd.microsoft.card.adaptive',
//     //     'content': {
//     //         '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json',
//     //         'type': 'AdaptiveCard',
//     //         'version': '1.0',
//     //         'body': [
//     //             {
//     //                 'type': 'Container',
//     //                 'items': [
//     //                     {
//     //                         'type': 'ColumnSet',
//     //                         'columns': [
//     //                             {
//     //                                 'type': 'Column',
//     //                                 'size': 'auto',
//     //                                 'items': [
//     //                                     {
//     //                                         'type': 'Image',
//     //                                         'url': 'https://s-media-cache-ak0.pinimg.com/originals/bb/c1/2b/bbc12bff3a544b88c3d408669231073a.png',
//     //                                         'size': 'medium',
//     //                                         'style': 'person'
//     //                                     }
//     //                                 ]
//     //                             },
//     //                             {
//     //                                 'type': 'Column',
//     //                                 'size': 'stretch',
//     //                                 'items': [
//     //                                     {
//     //                                         'type': 'TextBlock',
//     //                                         'text': 'Hello!',
//     //                                         'weight': 'bolder',
//     //                                         'isSubtle': true
//     //                                     },
//     //                                     {
//     //                                         'type': 'TextBlock',
//     //                                         'text': 'I can help you about CRM !',
//     //                                         'weight': 'bolder',
//     //                                         'isSubtle': true
//     //                                     },
//     //                                     {
//     //                                         'type': 'TextBlock',
//     //                                         'text': 'Please select from following choices?',
//     //                                         'wrap': true
//     //                                     }
//     //                                 ]
//     //                             }
//     //                         ]
//     //                     }
//     //                 ]
//     //             }
//     //         ],
//     //         'actions': [
//     //             {
//     //                 'type': 'Action.Submit',
//     //                 'title': 'CRM Support',
//     //                 'data': {
//     //                     'type': 'crmSupport'
//     //                 }
//     //             },
//     //             {
//     //                 'type': 'Action.Submit',
//     //                 'title': 'CRM training',
//     //                 'data': {
//     //                     'type': 'crmTrainer'
//     //                 }
//     //             },
//     //             {
//     //                 'type': 'Action.Submit',
//     //                 'title': 'CRM User',
//     //                 'data': {
//     //                     'type': 'crmUser'
//     //                 }
//     //             }
//     //         ]
//     //     }
//     // };

//     // var msg = new builder.Message(session)
//     //     .addAttachment(card);

//     var reply = new builder.Message()
//                     .address(message.address)
//                     .text('Welcome to CRM Bot.');
//     session.send(msg);
// });
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                var reply = new builder.Message()
                    .address(message.address)
                    .text('Welcome to CRM Bot.');
                bot.send(reply);
            }
        });
    }
});
bot.dialog('crmFeatures', require('./crm-features'));
bot.dialog('crmTrainer', require('./crmTrainer'));
bot.dialog('crmSupport', require('./crmSupport'));
bot.dialog('login', require('./login'));
bot.dialog('crmUser', require('./crmUser'));

// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});

function processSubmitAction(session, value) {

    var defaultErrorMessage = 'Please complete all the search parameters';
    switch (value.type) {
        //crm list module
        case 'crmUser':
            session.beginDialog('crmUser');

            break;
        //training module
        case 'crmTrainer':
            session.beginDialog('crmTrainer');

            break;

        //CRM tech support SOP
        case 'crmSupport':
            session.beginDialog('crmSupport', value);

            break;

        //crm login and features
        case 'wlSelection':
            session.beginDialog('login', value);

            break;
        case 'crmLogin':

            session.beginDialog('crmFeatures', value);
            break;
        default:
            // A form data was received, invalid or incomplete since the previous validation did not pass
            session.send(defaultErrorMessage);
    }
}


bot.dialog('/', [
    function (session) {
        session.say('I can help you about CRM');
        builder.Prompts.choice(session,
            'you have following list of features available, please Select your Choice ',
            ['CRM support', 'CRM Training', 'CRM User'],
            { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        if (results.response.entity.toLowerCase() == 'crm support' || results.response.entity.toLowerCase() == 'support') {
            session.beginDialog('crmsupport');
        } else if (results.response.entity.toLowerCase() == 'crm training') {
            session.beginDialog('crmtrainer');
        } else if (results.response.entity.toLowerCase() == 'crm user') {
            session.beginDialog('crmuser');
        } else {
            session.replaceDialog('/', { isReprompt: true });
        }
    }
]);

bot.dialog('crmuser', [
    function (session) {
        session.conversationData.crm = {};

        //-----------
        getWhitelabels(function (err, result) {
            var rows = '';
            // console.log(result);
            session.conversationData.wl = result;
            var rows = result.map(function (r) { return r.name });
            builder.Prompts.choice(session,
                'you have following list of available CRM.',
                rows,
                { listStyle: builder.ListStyle.button });

        });
        //===============
    },
    function (session, results) {
        //check for next
        if (results.response) {
            session.conversationData.wl_name = results.response;
            session.conversationData.wl.map(function (wlData) {
                if (wlData.name.toLowerCase() == results.response.entity.toLowerCase()) {
                    session.conversationData.api_url = wlData.api_url;
                }
            });
            
            // console.log(session.conversationData.wl);
            session.say('Please login with ' + results.response.entity + '"s CRM credentials: ');
            builder.Prompts.text(session, 'Please Provide an email : ');
        } else {
            builder.Prompts.text(session, 'Please select the CMR whitelabel: ');
        }
    },
    function (session, results) {
        //check for next
        if (results.response) {
            session.conversationData.email = results.response;
            builder.Prompts.text(session, 'Please Provide an Password : ');
        } else {
            builder.Prompts.text(session, 'Please select the CMR whitelabel: ');
        }
    },
    function (session, results) {
        //check for next
         if (results.response) {
            session.conversationData.password = results.response;
            session.say('Checking your login credentials : ');

            //apicall
                    // Set the headers
        var headers = {
            'merchantKey' : '12345',
            'domain' : 'crm.broctagon.com',
            'ip' : '127.0.0.1',
            'lang' : 'en'
        }

        // Configure the request
        var options = {
            url: session.conversationData.api_url+'login',
            method: 'POST',
            headers: headers,
            form: {'email': session.conversationData.email, 'password': session.conversationData.password}
        }
        // Start the request
            request(options, function (error, response, body) {
                body = JSON.parse(body);
                if (!error && response.statusCode == 200) {
                    var auth = body.token_type+" "+body.token;
                    session.conversationData.token = auth;
                     //call profile api
                     var headers = {
                        'merchantKey' : '12345',
                        'domain' : 'crm.broctagon.com',
                        'ip' : '127.0.0.1',
                        'lang' : 'en',
                        'Authorization' : auth
                    }
                     var options = {
                        url: session.conversationData.api_url+'profile',
                        method: 'GET',
                        headers: headers
                    }
                     request(options, function (error, response, body) {
                         var resData = JSON.parse(body);
                        if (!error && response.statusCode == 200) {
                            session.say( resData.name.label+': '+resData.name.value);
                            session.say( resData.email.label+': '+resData.email.value);
                            session.say( resData.document_verified.label+': '+resData.document_verified.value);
                            session.say( resData.country.label+': '+resData.country.value);
                            session.say( resData.city.label+': '+resData.city.value);
                        }else{
                           resData.msg[0].body.map(function(errorMsg){
                                session.say(errorMsg);
                            }); 
                        }
                     });
                }else{
                    body.msg[0].body.map(function(errorMsg){
                        session.say(errorMsg);
                    });
                //    session.say('login credentials are invalid : ');
                }
            });
            //-----

        } else {
            builder.Prompts.text(session, 'Please select the CMR whitelabel: ');
        }
    }
]);

function getWhitelabels(callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: "crmbot"
    });
    con.connect(function (err) {
        if (err) return callback(err);
        con.query("SELECT * FROM whitelabels ", function (err, result, fields) {
            if (err) {
                return callback(err);
            }

            if (result) {
                return callback(null, result);
            }
        });
    });
}