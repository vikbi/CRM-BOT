// This loads the environment variables from the .env file
require('dotenv-extended').load();

var util = require('util');
var builder = require('botbuilder');
var restify = require('restify');
var _ = require('lodash');
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

var bot = new builder.UniversalBot(connector, function (session) {

    if (session.message && session.message.value) {
        // A Card's Submit Action obj was received
        processSubmitAction(session, session.message.value);
        return;
    }
    var card = {
        'contentType': 'application/vnd.microsoft.card.adaptive',
        'content': {
            '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json',
            'type': 'AdaptiveCard',
            'version': '1.0',
            'body': [
                {
                    'type': 'Container',
                    'items': [
                        {
                            'type': 'ColumnSet',
                            'columns': [
                                {
                                    'type': 'Column',
                                    'size': 'auto',
                                    'items': [
                                        {
                                            'type': 'Image',
                                            'url': 'https://s-media-cache-ak0.pinimg.com/originals/bb/c1/2b/bbc12bff3a544b88c3d408669231073a.png',
                                            'size': 'medium',
                                            'style': 'person'
                                        }
                                    ]
                                },
                                {
                                    'type': 'Column',
                                    'size': 'stretch',
                                    'items': [
                                        {
                                            'type': 'TextBlock',
                                            'text': 'Hello!',
                                            'weight': 'bolder',
                                            'isSubtle': true
                                        },
                                        {
                                            'type': 'TextBlock',
                                            'text': 'I am CRM bot !',
                                            'weight': 'bolder',
                                            'isSubtle': true
                                        },
                                        {
                                            'type': 'TextBlock',
                                            'text': 'Please select from following choices?',
                                            'wrap': true
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            'actions': [
                {
                    'type': 'Action.Submit',
                    'title': 'CRM Support',
                    'data': {
                        'type': 'crmSupport'
                    }
                },
                {
                    'type': 'Action.Submit',
                    'title': 'CRM training',
                    'data': {
                        'type': 'crmTrainer'
                    }
                },
                {
                    'type': 'Action.Submit',
                    'title': 'CRM User',
                    'data': {
                        'type': 'crmUser'
                    }
                }
            ]
        }
    };

    var msg = new builder.Message(session)
                    .addAttachment(card);
    session.send(msg);
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
        case 'crmUser' : 
            session.beginDialog('crmUser');
             
        break;
        //training module
        case 'crmTrainer' : 
            session.beginDialog('crmTrainer');
             
        break;

        //CRM tech support SOP
        case 'crmSupport' : 
            session.beginDialog('crmSupport', value);
             
        break;

        //crm login and features
        case 'wlSelection' : 
            session.beginDialog('login', value);
             
        break;
        case 'crmLogin' : 
        
            session.beginDialog('crmFeatures', value);
        break;
        default:
            // A form data was received, invalid or incomplete since the previous validation did not pass
            session.send(defaultErrorMessage);
    }
}
