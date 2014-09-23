var kiwiModules = require('../server/modules'),
    fs = require('fs');

var module = new kiwiModules.Module('Ant Stats Module');

var log_file = fs.createWriteStream('ant_stats.log', {'flags': 'a'});

var antLog = function(tag, data){
    timestamp = Math.floor((new Date()).getTime() / 1000);
    log_file.write(timestamp.toString() + ' ' + tag  + ' ' + JSON.stringify(data) + '\n');
};

// A web client is connected
module.on('client created', function(event, data) {
    antLog('[client connection]', data);
});


// The Client recieves a IRC PRIVMSG command
module.on('irc message', function(event, data) {
	antLog('[MESSAGE]', data.irc_event);
});

// The Client recieves a IRC USER NOTICE command
module.on('irc user notice', function(event, data) {
	antLog('[NOTICE]', data.irc_event);
});

// The client recieves an IRC JOIN command
module.on('irc channel join', function(event, data) {
	antLog('[JOIN]', data.irc_event);
});


// A command has been sent from the client
module.on('client command', function(event, data) {
	var client_method = data.command.method;
	var client_args = data.command.args;

	antLog('[CLIENT COMMAND]', client_method);
	antLog('    ', client_args);
});
