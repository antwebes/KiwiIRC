if (!require('./configloader.js')()) {
    console.error('Couldn\'t find a valid config.js file (Did you copy the config.example.js file yet?)');
    process.exit(1);
}

var fs = require('fs');

module.exports = function(plugins){
    var pluginsEnabledDir = global.config.public_http + 'assets/plugins/enabled';

    plugins.forEach(function(plugin){
        var linkPlugin = pluginsEnabledDir + '/' + plugin + '.html';

        fs.unlink(linkPlugin, function(err){
            if(err){
                console.log(err);
            }else{
                console.log(plugin+' plugin disabled successfully');
            }
        });
    });
};