var kiwiModules = require('../server/modules'),
    fs = require('fs'),
   logger = require('fluent-logger');

var module = new kiwiModules.Module('Ant Stats Module');



logger.configure('kiwi', {
   host: global.config.fluentd.server,
   port: global.config.fluentd.port,
   timeout: global.config.timeout
});

var antLog = function(tag, log){
    timestamp = Math.floor((new Date()).getTime() / 1000);
    logger.emit("stats", log);
    console.log(tag, log);
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
            var type = rpcEvent;

            var logData = {
                nick: data.connection.nick,
                data: data.arguments[0],
            };

            if(rpcEvent == "privmsg") {
                var privmsg_type;
                    if(data.arguments[0].target.charAt(0) == "#") {
                        privmsg_type = "chan_msg";
                    }else{
                        privmsg_type = "priv_msg";
                        
                        if(data.arguments[0].target == "nickserv"){
                            if(!data.arguments[0].msg.indexOf("identifyoauth")) {
                                privmsg_type = "IDENTIFY";
                            } else {
                                privmsg_type = "NICKSERV_COMMAND";
                            }
                        } 
                        
                        var logData = {
                            nick: data.connection.nick,
                            data: {target: data.arguments[0].target, msg: "private"},
                            irc_host: data.connection.irc_host
                        };

                    }
                logData.privmsg_type = privmsg_type;
            } 

            logData.type = type;

        	antLog(rpcEvent, logData);
        });
    })(rpcEvents[i]);
}

module.on('rpc kiwi.connect_irc', function(event, data){
    var logData = {
        nick: data.nick,
        data: {
            address: data.user.address,
            hostname: data.user.hostname,
            ssl: data.ssl
        },
        type: 'connect'
    };
   
    antLog('connect', logData);
});

module.on('rpc irc.disconnect', function(event, data){
    var logData = {
        nick: data.connection.nick,
        data: {
            connection_id: data.arguments[0].connection_id,
            reason: data.arguments[0].reason
        },
        type: 'disconnect'
    };

    antLog('disconnect', logData);
});

// A command has been sent from the client
/*module.on('client command', function(event, data) {
	var client_method = data.command.method;
	var client_args = data.command.args;

	antLog('[CLIENT COMMAND]', client_method);
	antLog('    ', client_args);
});*/
