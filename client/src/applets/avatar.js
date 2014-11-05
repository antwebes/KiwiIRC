(function () {
                var View = Backbone.View.extend({
                    events: {

                    },

                    initialize: function (options) {

                    	var text = {
			                channel_name: _kiwi.global.i18n.translate('client_applets_chanlist_channelname').fetch(),
			                users: _kiwi.global.i18n.translate('client_applets_chanlist_users').fetch(),
			                topic: _kiwi.global.i18n.translate('client_applets_chanlist_topic').fetch()
			            };
			            this.$el = $(_.template($('#tmpl_avatar_config').html().trim(), text));

                    }

                });

                var Applet = Backbone.Model.extend({
                    initialize: function () {
                        this.set('title', "Avatar");
                        this.view = new View();
                    }
                });
                _kiwi.model.Applet.register('kiwi_avatar', Applet);
})();
