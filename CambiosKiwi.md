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
    En indext.tmpl.html

    en el template tmpl_application

    debadro de

    <div class="memberlists"></div>

    poner
    
    <div class="chat-extensions"></div>


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
En server/irc/connection.js cambiar el siguiente metodo:

- IrcConnection.prototype.end:

```
IrcConnection.prototype.end = function (data, afterDisconect) {
    var that = this;

    if (!this.socket) {
        return;
    }

    this.requested_disconnect = true;

    if (data) {
        // Once the last bit of data has been sent, then re-run this function to close the socket
        this.write(data, true, function() {
            if(afterDisconect){
                afterDisconect();
            }

            that.end();
        });

        return;
    }

    this.socket.end();
};
```

En server/irc/state.js cambiar el constructor por:

```
var State = function (client, save_state) {
    var that = this;

    events.EventEmitter.call(this);
    this.client = client;
    this.save_state = save_state || false;

    this.irc_connections = [];
    this.next_connection = 0;

    this.client.on('dispose', function () {
        if (!that.save_state) {
            _.each(that.irc_connections, function (irc_connection, i, cons) {
                if (irc_connection) {
                    irc_connection.end('QUIT :' + (irc_connection.quit_message || global.config.quit_message || ''), function(){
                        console.close('finished');
                        global.servers.removeConnection(irc_connection);
                        cons[i] = null;
                    });
                }
            });

            that.dispose();
        }
    });
};
```

En server/helpers/build.js

Sustituir

```
    fs.readdir(global.config.public_http + '/src/translations', function (err, translation_files) {
        if (!err) {
            translation_files.forEach(function (file) {
                var locale = file.slice(0, -3);
                if ((file.slice(-3) === '.po') && (locale !== 'template')) {
                    po2json.parseFile(global.config.public_http + '/src/translations/' + file, {format: 'jed', domain: locale}, function (err, json) {
                        if (!err) {
                            fs.writeFile(global.config.public_http + '/assets/locales/' + locale + '.json', JSON.stringify(json), function (err) {
                                if (!err) {
                                    console.log('Built translation file %s.json', locale);
                                } else {
                                    console.error('Error building translation file %s.json:', locale, err);
                                }
                            });
                        } else {
                            console.error('Error building translation file %s.json: ', locale, err);
                        }
                    });
                }
            });
        } else {
            console.error('Error building translation files:', err);
        }
    });
```
por

```
var pluginsTransPromise = new Promise(function(resolve, reject){
    var pluginsTrans = {};
    var proccessedFiles = 0;

    fs.readdir(global.config.public_http + 'assets/plugins/translations', function (err, translation_files) {
        if (!err) {
            translation_files.forEach(function (file) {
                var parts = file.split('.'); // parts[0] = plugin name, parts[1] = language, parts[2] = .po
                var locale = parts[1];

                if (parts[2] === 'po'){
                    if(typeof pluginsTrans[locale] == 'undefined'){
                        pluginsTrans[locale] = {};
                    }

                    po2json.parseFile(global.config.public_http + 'assets/plugins/translations/' + file, {format: 'jed', domain: locale}, function (err, json) {
                        if (!err) {
                            for(msgid in json.locale_data[locale]){
                                if(msgid != ''){
                                    pluginsTrans[locale][msgid] = json.locale_data[locale][msgid];
                                }
                            }
                        }

                        proccessedFiles++;

                        if(proccessedFiles == translation_files.length){
                            resolve(pluginsTrans);
                        }
                    });
                }
            });
        }
    });
});

fs.readdir(global.config.public_http + '/src/translations', function (err, translation_files) {
    if (!err) {
        var tanslatedLanguages = {};
        var proccessedFiles = 0;

        var finalTransPromise = new Promise(function(resolve, reject) {
            translation_files.forEach(function (file) {
                var locale = file.slice(0, -3);

                if ((file.slice(-3) === '.po') && (locale !== 'template')) {
                    po2json.parseFile(global.config.public_http + '/src/translations/' + file, {
                        format: 'jed',
                        domain: locale
                    }, function (err, json) {
                        if (!err) {
                            (function (json, locale) {
                                var toJSONFfile = function (pluginsTrans) {
                                    if (typeof pluginsTrans[locale] != 'undefined') {
                                        for (msgid in pluginsTrans[locale]) {
                                            json.locale_data[locale][msgid] = pluginsTrans[locale][msgid];
                                        }
                                    }

                                    tanslatedLanguages[locale] = json;
                                    proccessedFiles++;

                                    if(proccessedFiles == translation_files.length){
                                        resolve(tanslatedLanguages);
                                    }
                                };

                                pluginsTransPromise.then(toJSONFfile, function () {
                                    toJSONFfile({});
                                });
                            })(json, locale);
                        } else {
                            console.error('Error building translation file %s.json: ', locale, err);
                        }
                    });
                }else{
                    proccessedFiles++;
                }
            });
        });

        finalTransPromise.then(function(translations){
            var defaultLanguage = translations['en-gb'].locale_data['en-gb'];

            for(translation in translations){
                (function(translations, translation){
                    for(translationKey in defaultLanguage){
                        if(typeof translations[translation].locale_data[translation][translationKey] == 'undefined'){
                            translations[translation].locale_data[translation][translationKey] = defaultLanguage[translationKey];
                        }
                    }

                    fs.writeFile(global.config.public_http + '/assets/locales/'+translation+'.json', JSON.stringify(translations[translation]), function (err) {
                        if (!err) {
                            console.log('Built translation file %s.json', translation);
                        } else {
                            console.error('Error building translation file %s.json:', translation, err);
                        }
                    });
                })(translations, translation);
            }
        });
    } else {
        console.error('Error building translation files:', err);
    }
});
```