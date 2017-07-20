'use strict';
var Alexa = require('alexa-sdk');
var request = require('request');
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

var languageStrings = {    
    "en-US": {
        "translation": {            
            "SKILL_NAME" : "Local Deals",
            "HELP_MESSAGE" : "Ask me for local deals!",
            "HELP_REPROMPT" : "Ask me for a local deal.",
            "STOP_MESSAGE" : "Goodbye!"
        }
    }    
};

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('FindLocalDealsIntent');
    },   
    'FindLocalDealsIntent': function () {
        outputResult(this, function(results) {
            console.log(results);
            var index = Math.floor(Math.random() * results.length);
            return results[index];
        });
    },    
    'AMAZON.HelpIntent': function () {
        var speechOutput = this.t("HELP_MESSAGE");
        var reprompt = this.t("HELP_MESSAGE");
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    }
};

function outputResult(obj, findFunction) {
    request('https://partner-api.groupon.com/deals.json?tsToken=US_AFF_0_201236_212556_0&offset=0&limit=50', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var json = JSON.parse(body);
        var elem = findFunction(json.deals);
        output(obj, elem);
      }
    });
}

function output(obj, elem) {
    var message = `Here's a deal: ${elem.title}`;
    
    obj.emit(':tellWithCard', message, obj.t("SKILL_NAME"), message);
}