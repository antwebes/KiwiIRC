Plugins comprension
-------------------

This doc shows how to enable plugins and compress them. Note that after compressing them, the resulting file
is written in client/assets/plugins/plugins_dist.html which is the file you have to put in conf.client_plugins sections: 

```
conf.client_plugins = [
    "/kiwi/assets/plugins/plugins_dist.html"
];
```

Enabling plugins
================

To enable a plugins for compression, you just have to put a simbolic link to the plugins you want to enable in 
client/assets/plugins/enabled like the example showen bellow:

```
cd client/assets/plugins/enabled
ln -s client/assets/plugins/auto_login.html auto_login.html
```

Note: the name of the simbolyc links have to end with the html extension.

Compressing enabled plugins
===========================

To compress all enabled plugins in the dist file client/assets/plugins/plugins_dist.html just run the command grunt.

Notes to develop plugins
========================

If your plugin needs html templates, you have to put the template in a js var. To put new style, add the syle tags with
jQuery to the head tag.