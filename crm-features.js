var util = require('util');
var _ = require('lodash');
var builder = require('botbuilder');
var crmApi = require('./crmApi');

module.exports = function login(session, info) {
    session.send(
        'checking your login credentials...',
        info.name);

        //call api with login creds and show features list
        crmApi
        .apiCall(session, info)
        .then(function(resData){

            session.send('Successfully logged in');
            //--------------log
            var docStatus = "Not Verified";
            if(resData.document_verified.value == '1'){
                docStatus = "Verified";
            }
            
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
                                        'text': 'User Profile Information',
                                        'size': 'extraLarge',
                                    },
                                    {
                                        'type': 'TextBlock',
                                        'text': resData.name.label+': '+resData.name.value,
                                    },
                                    {
                                        'type': 'TextBlock',
                                        'text': resData.email.label+': '+resData.email.value,
                                    },
                                    {
                                        'type': 'TextBlock',
                                        'text': resData.phone[0].label+': '+resData.phone[0].value,
                                    },
                                    {
                                        'type': 'TextBlock',
                                        'text': resData.document_verified.label+': '+docStatus,
                                    },
                                    {
                                        'type': 'TextBlock',
                                        'text': resData.country.label+': '+resData.country.value,
                                    },
                                    {
                                        'type': 'TextBlock',
                                        'text': resData.city.label+': '+resData.city.value,
                                    },
                                    {
                                        'type': 'TextBlock',
                                        'text': resData.state.label+': '+resData.state.value,
                                    }
                            ]
                        }
                        
                    ]
                }
            };

            var msg = new builder.Message(session)
                .addAttachment(card);
            session.send(msg);
        })
        .catch(function(resData){
            console.log(resData);
        });
};
