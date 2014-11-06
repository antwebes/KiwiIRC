Cambios en el kiwi
------------------
1:
	_kiwi.view.Application:

		this.$el.appendTo($('body'));

		reemplazado por:

		this.$el.appendTo($(this.model.get('container') || 'body'));

	Nota: a ver porque es necesario y si se puede hacer pull request.


2: Volvemos a la versión original de kiwi y el onbuferedUnload lo sobrescribimos en el plugin de tracker

	src/translations/en-gb.po

	This will close all conversations. Are you sure you want to close this window and exit of chat?	

     msgid "client_views_application_close_notice"
	-msgstr "This will close all KiwiIRC conversations. Are you sure you want to close this window?"
	+msgstr "This will close all conversations. Are you sure you want to close this window and exit of chat?"
 

3:

	Desactivar ctcp: (Pendiente)

4:

	Incluir los applet:
		avatar.js


Cambios en el kiwi, que sería recomendable cambiar a plugin
-----------------------------------------------------------

1:
	Archivo: rightbar.js

	Nueva función de show:

	    show: function(channelMode) {
	        if(typeof(channelMode) == 'undefined'){
	            channelMode = true;
	        }

	        this.hidden = false;
	        
	        if(channelMode){
	            $('.right_bar .channel_info, .right_bar .channel_part').show();
	        }else{
	            $('.right_bar .channel_info, .right_bar .channel_part').hide();
	        }

	        if (!this.keep_hidden)
	            this.$el.removeClass('disabled');

	        this.updateIcon();
	    },

	Archivo: client/src/models/application.js

		Se añade:
		_kiwi.global.components.Applet = _kiwi.model.Applet;

2:

	Archivo: client/src/views/memberlist.js
	Commit: https://github.com/antwebes/KiwiIRC/commit/3ea1c8bcdf81cab28af7f9b27a384e7c26e5af17

	Cambiar función show:
	
	    show: function () {
	        $('#kiwi .memberlists').children().removeClass('active');
	        $(this.el).addClass('active');


	        $('#kiwi .memberlists').empty();
	        this.$el.appendTo('#kiwi .memberlists');

	        //we need to assign the handlers
	        this.model.forEach(function (member) {
	            member.view.$el.data('member', member);
	        });

	        this.delegateEvents();
	    }

Cambios en la parte server
--------------------------

En server/cliente.js cambiar los siguientes metos.

- Client.prototype.sendIrcCommand por:

```
Client.prototype.sendIrcCommand = function (command, data, callback) {
    var c = {command: command, data: data};
    connection = this.state.irc_connections[data.connection_id];
    global.modules.emit('rpc irc.'+command, {
            arguments: [data],
            client: this,
            connection: connection
        });
    this.rpc('irc', c, callback);
};
```

- Client.prototype.attachKiwiCommands por:

```
Client.prototype.attachKiwiCommands = function() {
    var that = this;

    function doAttachKiwiCommand(commandName, handler){
        var handlerWrapper = function(){
            var args = Array.prototype.slice.call(arguments)
            global.modules.emit('rpc '+commandName, args[1]);
            handler.apply(null, args);
        };

        that.rpc.on(commandName, handlerWrapper);
    }

    doAttachKiwiCommand('kiwi.connect_irc', function(callback, command) {
        if (command.hostname && command.port && command.nick) {
            var options = {};

            // Get any optional parameters that may have been passed
            if (command.encoding)
                options.encoding = command.encoding;

            options.password = global.config.restrict_server_password || command.password;

            that.state.connect(
                (global.config.restrict_server || command.hostname),
                (global.config.restrict_server_port || command.port),
                (typeof global.config.restrict_server_ssl !== 'undefined' ?
                    global.config.restrict_server_ssl :
                    command.ssl),
                command.nick,
                {hostname: that.websocket.meta.revdns, address: that.websocket.meta.real_address},
                options,
                callback);
        } else {
            return callback('Hostname, port and nickname must be specified');
        }
    });


    doAttachKiwiCommand('kiwi.client_info', function(callback, args) {
        // keep hold of selected parts of the client_info
        that.client_info = {
            build_version: args.build_version.toString() || undefined
        };
    });


    // Just to let us know the client is still there
    doAttachKiwiCommand('kiwi.heartbeat', function(callback, args) {
        that.heartbeat();
    });
};
```