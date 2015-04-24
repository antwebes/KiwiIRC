Translate plugins
=================

To tranlate a plugin, just create a file under the ```client/assets/plugins/translations/``` with  the name ```PLUGIN_NAME.LOCALE.po``` where you put your translations in po format. Suposing you want to translate the ```foo_bar``` plugin for the ```es``` locale, just create the ```client/assets/plugins/translations/foo_bar.es.po``` file.

All translations under the ```client/assets/plugins/translations/``` directory are automaticly added to the JSON translation file of kiwi when you execute:

```
$ ./kiwi build
```