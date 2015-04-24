if (!require('./configloader.js')()) {
    console.error('Couldn\'t find a valid config.js file (Did you copy the config.example.js file yet?)');
    process.exit(1);
}

var fs = require('fs');

module.exports = function(plugins){
    var pluginsDir = global.config.public_http + 'assets/plugins';
    var pluginsEnabledDir = global.config.public_http + 'assets/plugins/enabled';

    plugins.forEach(function(plugin){
        var srcPlugin = pluginsDir + '/' + plugin + '.html',
            linkPlugin = pluginsEnabledDir + '/' + plugin + '.html';

        fs.symlink(srcPlugin, linkPlugin, 'file', function(err, path){
            if(err){
                console.log(err);
            }else{
                console.log(plugin+' plugin enabled successfully');
            }
        });
    });
};