var kiwiModules = require('../server/modules'),
    fs = require('fs');

var module = new kiwiModules.Module('Ant Stats Module');

var log_file = fs.createWriteStream('ant_stats.log', {'flags': 'a'});

var antLog = function(tag, data){
    timestamp = Math.floor((new Date()).getTime() / 1000);
    console.log(timestamp.toString() + ' [' + tag  + '] ' + JSON.stringify(data) + '\n');
};

// A web client is connected
module.on('client created', function(event, data) {
    antLog('client connection', data);
});


// The Client recieves a IRC PRIVMSG command
/*module.on('rpc irc.privmsg', function(event, data) {
	var logData = {
        nick: data.connection.nick,
        data: data.arguments[0]
    };

    antLog('[MESSAGE]', logData);
});

// The Client recieves a IRC USER NOTICE command
module.on('rpc irc.notice', function(event, data) {
	antLog('[NOTICE]', event);
});*/

var rpcEvents = ['privmsg', 'join', 'part', 'kick', 'quit', 'nick'];


for(i in rpcEvents){
    // The client recieves an IRC JOIN command
    
    (function(rpcEvent){
        module.on('rpc irc.' + rpcEvent, function(event, data){
            var logData = {
                nick: data.connection.nick,
                data: data.arguments[0],
                irc_host: data.connection.irc_host
            };

        	antLog(rpcEvent, logData);
        });
    })(rpcEvents[i]);
}


// A command has been sent from the client
/*module.on('client command', function(event, data) {
	var client_method = data.command.method;
	var client_args = data.command.args;

	antLog('[CLIENT COMMAND]', client_method);
	antLog('    ', client_args);
});*/
