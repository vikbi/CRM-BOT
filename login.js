var util = require('util');
var _ = require('lodash');
var builder = require('botbuilder');

module.exports = function login(session, info) {
    session.send(
        'Ok. Looking for %s"s CRM features...',
        info.name);

        session.conversationData.api_url = info.api_url;
        console.log(session.conversationData.api_url);
            var card = {
                'contentType': 'application/vnd.microsoft.card.adaptive',
                'content': {
                    'type': 'AdaptiveCard',
                    'body': [
                        {
                            'type': 'Container',
                            'items' : [
                                    {
                                        'type': 'TextBlock',
                                        'text': 'Please login with your CRM credentials',
                                        'size': 'extraLarge'
                                    },
                                    //email
                                    {
                                        'type': 'TextBlock',
                                        'text': 'Email :'
                                    },
                                    {
                                        'type': 'Input.Text',
                                        'id': 'email',
                                        'style': 'text'
                                    },
                                    //------------//
                                    //email
                                    {
                                        'type': 'TextBlock',
                                        'text': 'Password :'
                                    },
                                    {
                                        'type': 'Input.Text',
                                        'id': 'password',
                                        'style': 'text'
                                    },
                                    //------------//
                            ]
                        }
                        
                    ],
                    'actions': [
                            {
                                'type': 'Action.Submit',
                                'title': 'Login',
                                'data': {
                                    'type': 'crmLogin'
                                }
                            }
                        ]
                }
            };

            var msg = new builder.Message(session)
                .addAttachment(card);
            session.send(msg);

    session.endDialog();
};
