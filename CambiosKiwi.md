Cambios en el kiwi
------------------
1:
	_kiwi.view.Application:

		this.$el.appendTo($('body'));

		reemplazado por:

		this.$el.appendTo($(this.model.get('container') || 'body'));


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

	        // The list for holding the nicks
	        this.$list = $('<ul></ul>').appendTo(this.$el);

	        //we need to assign the handlers
	        this.model.forEach(function (member) {
	            member.view.$el.data('member', member);
	        });

	        this.delegateEvents();
	    }
