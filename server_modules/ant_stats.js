var kiwiModules = require('../server/modules'),
    fs = require('fs')
   logger = require('fluent-logger');

var module = new kiwiModules.Module('Ant Stats Module');

var log_file = fs.createWriteStream('ant_stats.log', {'flags': 'a'});


logger.configure('kiwi', {
   host: global.config.fluentd.server,  
   port: global.config.fluentd.port,
   timeout: global.config.timeout
});

var antLog = function(tag, data){
    timestamp = Math.floor((new Date()).getTime() / 1000);
    data.type = tag;
    switch(tag) {
        case "privmsg":
            console.log("target " + data.target);
            if(data.data.target.charAt(0) == "#") {
                data.type = "chan_msg";
            }else{
                data.type = "priv_msg";
                delete data.data.msg;
                if(data.data.target == "nickserv"){
                    if(data.msg.indexOf("identifyoauth")) {
                        data.type = "IDENTIFY";
                    } else {
                        data.type = "NICKSERV_COMMAND";
                    }
                } 
            }
        break;
    }

    logger.emit("stats", data);
};



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
