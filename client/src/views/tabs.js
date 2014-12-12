// Model for this = _kiwi.model.PanelList
_kiwi.view.Tabs = Backbone.View.extend({
    tagName: 'ul',
    className: 'panellist mm-list mm-panel mm-opened mm-current',

    events: {
        'click li': 'tabClick',
        'click .part': 'partClick'
    },

    initialize: function () {
        this.model.on("add", this.panelAdded, this);
        this.model.on("remove", this.panelRemoved, this);
        this.model.on("reset", this.render, this);

        this.model.on('active', this.panelActive, this);

        // Network tabs start with a server, so determine what we are now
        this.is_network = false;

        if (this.model.network) {
            this.is_network = true;

            this.model.network.on('change:name', function (network, new_val) {
                $('span', this.model.server.tab).text(new_val);
            }, this);

            this.model.network.on('change:connection_id', function (network, new_val) {
                this.model.forEach(function(panel) {
                    panel.tab.data('connection_id', new_val);
                });
            }, this);
        }
    },

    render: function () {
        var that = this;

        this.$el.empty();

        if (this.is_network) {
            // Add the server tab first
            this.model.server.tab
                .data('panel', this.model.server)
                .data('connection_id', this.model.network.get('connection_id'))
                .appendTo(this.$el);
        }

        // Go through each panel adding its tab
        this.model.forEach(function (panel) {
            // If this is the server panel, ignore as it's already added
            if (this.is_network && panel == that.model.server)
                return;

            panel.tab.data('panel', panel);

            if (this.is_network)
                panel.tab.data('connection_id', this.model.network.get('connection_id'));

            panel.tab.appendTo(that.$el);
        });

        _kiwi.app.view.doLayout();
    },

    updateTabTitle: function (panel, new_title) {
        $('span', panel.tab).text(new_title);
    },

    updateCounters: function() {
        var countPrivates = 0;
        var countRooms = 0;
        var count = true;
        this.model.forEach(function (panel) {
            var name = panel.get('name');
            if(name.indexOf('applet_') == -1) {
                if(name[0] == "#") countRooms++;
                else {
                    if(name != "Server")
                        countPrivates++; 
                }
            } else {
                //en el caso de que exista algún applet es que estamos en la tab de applets, no contamos
                count = false;;
            }
        });
        if(count) {
            $("#countRooms").html(countRooms);
            $("#countPrivates").html(countPrivates);
        }
    },

    panelAdded: function (panel) {
        // Add a tab to the panel
        panel.tab = $('<li><span>' + (panel.get('title') || panel.get('name')) + '<b class="activity badge"></b></span></li>');

        if (panel.isServer()) {
            panel.tab.addClass('server');
            panel.tab.addClass('fa');
            panel.tab.addClass('fa-bolt');
        }

        panel.tab.data('panel', panel);

        if (this.is_network)
            panel.tab.data('connection_id', this.model.network.get('connection_id'));

        this.sortTabs();

        panel.bind('change:title', this.updateTabTitle);
        panel.bind('change:name', this.updateTabTitle);

        this.updateCounters();
        _kiwi.app.view.doLayout();
    },
    panelRemoved: function (panel) {
        var connection = _kiwi.app.connections.active_connection;

        panel.tab.remove();
        delete panel.tab;

        _kiwi.app.panels.trigger('remove', panel);
        
        this.updateCounters();
        _kiwi.app.view.doLayout();
    },

    panelActive: function (panel, previously_active_panel) {
        // Remove any existing tabs or part images
        $('.panellist .part').remove();
        $('.panellist .active').removeClass('active mm-selected');

        panel.tab.addClass('active mm-selected');
        
        $("#activePanelName").html(panel.get('title') || panel.get('name'));

        // Only show the part image on non-server tabs
        if (!panel.isServer()) {
            $("span",panel.tab).append('<i class="part fa fa-times"></i>');
        }
    },

    tabClick: function (e) {
        var tab = $(e.currentTarget);

        var panel = tab.data('panel');
        if (!panel) {
            // A panel wasn't found for this tab... wadda fuck
            return;
        }

        panel.view.show();
    },

    partClick: function (e) {
        var tab = $(e.currentTarget).parent().parent();
        var panel = tab.data('panel');

        if (!panel) return;

        // Only need to part if it's a channel
        // If the nicklist is empty, we haven't joined the channel as yet
        if (panel.isChannel() && panel.get('members').models.length > 0) {
            this.model.network.gateway.part(panel.get('name'));
        } else {
            panel.close();
        }
    },

    sortTabs: function() {
        var that = this,
            panels = [];

        this.model.forEach(function (panel) {
            // Ignore the server tab, so all others get added after it
            if (that.is_network && panel == that.model.server)
                return;

            panels.push([panel.get('title') || panel.get('name'), panel]);
        });

        // Sort by the panel name..
        panels.sort(function(a, b) {
            if (a[0].toLowerCase() > b[0].toLowerCase()) {
                return 1;
            } else if (a[0].toLowerCase() < b[0].toLowerCase()) {
                return -1;
            } else {
                return 0;
            }
        });

        // And add them all back in order.
        _.each(panels, function(panel) {
            panel[1].tab.appendTo(that.$el);
        });
    }
});