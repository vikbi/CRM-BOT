var util = require('util');
var _ = require('lodash');
var builder = require('botbuilder');

module.exports = function login(session, info) {
    session.send('Support chat can be implemented, currently having sample FAQ"s');
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
                                        'text': 'sample FAQ for CRM support',
                                        'size': 'extraLarge'
                                    },
                                    {
                                        'type': 'TextBlock',
                                        'text': 'What is CRM? :'
                                    },
                                    {
                                        'type': 'TextBlock',
                                        'text': 'What information does the dashboard of CRM contains? :'
                                    },
                                    {
                                        'type': 'TextBlock',
                                        'text': 'What are commissions and how can I manage it? :'
                                    },
                                    //------------//
                                    {
                                        'type': 'TextBlock',
                                        'text': 'Have something to ask CRM support ?:'
                                    },
                                    {
                                        'type': 'Input.Text',
                                        'id': 'question',
                                        'style': 'text'
                                    },
                                    //------------//
                            ]
                        }
                        
                    ],
                    'actions': [
                            {
                                'type': 'Action.Submit',
                                'title': 'Ask Support',
                                'data': {
                                    'type': 'Ask'
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
