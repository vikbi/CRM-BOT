var Promise = require('bluebird');
var request = require('request');
module.exports = {
    apiCall : function (session, userData) {
        return new Promise(function (resolve,reject) {

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
            form: {'email': userData.email, 'password': userData.password}
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
                         body = JSON.parse(body);
                        if (!error && response.statusCode == 200) {
                            resolve(body);
                        }
                     });
                }else{
                    reject(body);
                }
            });
        });
    }
}