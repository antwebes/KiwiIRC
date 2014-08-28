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

		
