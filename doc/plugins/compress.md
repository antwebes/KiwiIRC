Compress plugins
================

In this section we show you how to enable/disable plugins to be compressed into a single file, how to compress them and some considerations to develop plugins taken pluglins compression into consideration.

Enable/Disable plugins
----------------------

Under the directroy ```client/assets/plugins/``` there is a directory ```enabled```. All plugins found in this directory (use symlinks to the original plugins) can be compressed into a single file.

To enable/disable plugins just create/remove symlinks to the original plugin in the ```client/assets/plugins/enabled``` directory.

There are to commands in kiwi to enable and disable multiple plugins:

* ``` $ ./kiwi enable-plugins plugin1 plugin2 plugin3```
* ``` $ ./kiwi disable-plugins plugin1 plugin2 plugin3```
 
Notice that the name of the plugins are written without the **.html** extension.

Compress plugins
----------------

To compress the plugins just execute grunt without arguments: 

```$ grunt```

This will generate the ```client/assets/plugins/plugins_dist.html```file with all plugins concatenated and compressed.

Plugin development considerations
---------------------------------

Since all plugins are minified into a single file, don't use any html makup except the ```<script>``` wich is removed. So if you want some html template, instead of creating it directly in makrup, assigne it as a string to a variable. So instead of:
```javascript
<div id="my-super-template>
    <h1><%= title_plugin %>
</div

var tmpl = $("#my-super-template").html();

_.template(tmpl);
```

use this form:

```javascript
var tmpl = '<div id="my-super-template>\n' +
           '    <h1><%= title_plugin %>\n' +
           '</div>';

_.template(tmpl);
```

If you need to include style, add them with jquery but not dicectly with the ```<style>``` tag, instead inject the tag with Jquery like this:

```
var styleHtml = '<style>.mySuprerstyle{ backgroud: red; }</style>';
$(styleHtml).appendTo($('head'));
```